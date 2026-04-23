import { spawn } from 'node:child_process';
import process from 'node:process';

const workspaceRoot = new URL('..', import.meta.url).pathname;

const backendProcess = spawn(
  'dotnet',
  ['run', '--no-launch-profile', '--project', './backend/WanJiaDengHuo.API/WanJiaDengHuo.API.csproj'],
  {
    cwd: workspaceRoot,
    stdio: 'inherit',
    env: {
      ...process.env,
      ASPNETCORE_ENVIRONMENT: 'Development',
      ASPNETCORE_URLS: `http://127.0.0.1:${process.env.BACKEND_PORT ?? '5290'}`,
      Database__Provider: 'InMemory'
    }
  }
);

const exitWithSignal = (signal) => {
  if (!backendProcess.killed) {
    backendProcess.kill(signal);
  }
};

process.on('SIGINT', () => exitWithSignal('SIGINT'));
process.on('SIGTERM', () => exitWithSignal('SIGTERM'));

backendProcess.on('exit', (code, signal) => {
  if (signal) {
    process.exit(0);
  }

  process.exit(code ?? 0);
});