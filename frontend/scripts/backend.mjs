import { spawn } from 'node:child_process';
import process from 'node:process';

const backendProcess = spawn(
  'dotnet',
  ['run', '--project', '../backend/WanJiaDengHuo.API/WanJiaDengHuo.API.csproj'],
  {
    cwd: new URL('..', import.meta.url).pathname,
    stdio: 'inherit',
    env: {
      ...process.env,
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