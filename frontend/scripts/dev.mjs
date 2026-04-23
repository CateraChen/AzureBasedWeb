import { spawn } from 'node:child_process';
import process from 'node:process';

const workspaceRoot = new URL('..', import.meta.url).pathname;
const frontendProcess = spawn('npm', ['run', 'dev:frontend'], {
  cwd: workspaceRoot,
  stdio: ['inherit', 'pipe', 'pipe'],
  env: process.env
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
    env: process.env
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