import { spawn } from 'node:child_process';
import net from 'node:net';
import process from 'node:process';

const workspaceRoot = new URL('..', import.meta.url).pathname;

const pickFreePort = () => new Promise((resolve, reject) => {
  const server = net.createServer();
  server.unref();
  server.once('error', reject);
  server.listen(0, '127.0.0.1', () => {
    const address = server.address();
    const port = typeof address === 'object' && address ? address.port : null;
    server.close(() => {
      if (port) {
        resolve(port);
      } else {
        reject(new Error('Could not allocate a free backend port.'));
      }
    });
  });
});

const start = async () => {
  const backendPort = await pickFreePort();
  const sharedEnv = {
    ...process.env,
    BACKEND_PORT: String(backendPort),
    VITE_API_URL: `http://127.0.0.1:${backendPort}`
  };

  const frontendProcess = spawn('npm', ['run', 'dev:frontend'], {
    cwd: workspaceRoot,
    stdio: ['inherit', 'pipe', 'pipe'],
    env: sharedEnv
  });

  let backendProcess;
  let backendStarted = false;
  let startupTimer;

  const startBackend = () => {
    if (backendStarted) {
      return;
    }

    backendStarted = true;
    backendProcess = spawn('npm', ['run', 'dev:backend'], {
      cwd: workspaceRoot,
      stdio: 'inherit',
      env: sharedEnv
    });

    backendProcess.on('exit', (code, signal) => {
      if (signal) {
        process.exit(0);
      }

      process.exit(code ?? 0);
    });
  };

  const shutdown = (signal) => {
    if (frontendProcess && !frontendProcess.killed) {
      frontendProcess.kill(signal);
    }

    if (backendProcess && !backendProcess.killed) {
      backendProcess.kill(signal);
    }
  };

  frontendProcess.stdout.on('data', (chunk) => {
    process.stdout.write(chunk);

    const text = chunk.toString();
    if (!backendStarted && (text.includes('VITE') || text.includes('Local:') || text.includes('ready'))) {
      clearTimeout(startupTimer);
      startBackend();
    }
  });

  frontendProcess.stderr.on('data', (chunk) => {
    process.stderr.write(chunk);
  });

  frontendProcess.on('exit', (code, signal) => {
    if (!backendStarted) {
      clearTimeout(startupTimer);
      startBackend();
    }

    if (signal) {
      process.exit(0);
    }

    process.exit(code ?? 0);
  });

  startupTimer = setTimeout(startBackend, 1500);

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});