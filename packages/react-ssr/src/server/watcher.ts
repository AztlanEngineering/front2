#!/usr/bin/env bun

import { spawn, execSync, ChildProcess } from 'child_process';
import { watch } from 'fs';
import { resolve } from 'path';
import { parseArgs } from 'util';

let serverProcess: ChildProcess | null = null;

const debounce = (fn: (...args: any[]) => void, delay: number) => {
  return (...args: any[]) => {
    clearTimeout((fn as any).id);
    (fn as any).id = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const killProcessUsingPort = (port: number) => {
  try {
    const result = execSync(`lsof -i:${port} -t`).toString();
    if (result) {
      const pids = result.trim().split('\n');
      for (const pid of pids) {
        process.kill(parseInt(pid, 10));
      }
      console.log(`Killed processes using port ${port}: ${pids.join(', ')}`);
    }
  } catch (err: any) {
    if (err.message) {
      console.error(`Failed to kill process using port ${port}: ${err.message}`);
    }
  }
};

const killServerProcess = (): Promise<void> => {
  return new Promise((resolve) => {
    if (!serverProcess) {
      resolve();
      return;
    }

    serverProcess.on('close', resolve);
    serverProcess.kill();
  });
};

const startServer = async () => {
  await killServerProcess();

  const port = 5173;
  killProcessUsingPort(port);

  serverProcess = spawn('bun', ['run', 'preview'], { stdio: 'inherit' });

  serverProcess.on('close', (code) => {
    if (code !== null && code !== 0) {
      console.error(`Server process exited with code ${code}`);
    }
  });
};

const startBuild = () => {
  // const buildProcess = spawn('bun', ['run', 'build'], { stdio: 'inherit' });
  //
  // buildProcess.on('close', (code) => {
  //   if (code !== null && code !== 0) {
  //     console.error(`Build process exited with code ${code}`);
  //   }
  // });
  startServer();
};

const debouncedStartServer = debounce(startServer, 200);
const debouncedStartBuild = debounce(startBuild, 200);

// Parse command-line arguments using util.parseArgs
const { values } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    'dir': {
      type: 'string',
      multiple: true,
      default: [resolve(process.cwd(), './src')],
      alias: 'd',
    },
  },
  strict: true,
  allowPositionals: true,
});

// Resolve all watch directories
const watchDirs = values['dir'].map((dir: string) => resolve(process.cwd(), dir));

// Watch for changes in the provided directories
watchDirs.forEach((dir) => {
  watch(dir, { recursive: true }, (eventType, filename) => {
    console.log(`File changed in ${dir}: ${filename}`);
    if (dir.includes('server')) {
      debouncedStartServer();
    } else {
      debouncedStartBuild();
    }
  });
});

// Start the initial server
startBuild();

