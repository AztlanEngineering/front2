import { spawn, execSync } from 'child_process';
import { watch } from 'fs';

let serverProcess = null;

const debounce = (fn, delay) => {
  return (...args) => {
    clearTimeout(fn.id);
    fn.id = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const killProcessUsingPort = (port) => {
  try {
    const result = execSync(`lsof -i:${port} -t`).toString();
    if (result) {
      const pids = result.trim().split('\n');
      for (const pid of pids) {
        process.kill(pid);
      }
      console.log(`Killed processes using port ${port}: ${pids.join(', ')}`);
    }
  } catch (err) {
    if (err.message){
      console.error(`Failed to kill process using port ${port}: ${err.message}`);
    }
  }
};

const killServerProcess = () => {
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
  const buildProcess = spawn('bun', ['run', 'build'], { stdio: 'inherit' });

  buildProcess.on('close', (code) => {
    if (code !== null && code !== 0) {
      console.error(`Build process exited with code ${code}`);
    }
  });
  startServer();
};

const debouncedStartServer = debounce(startServer, 200);
const debouncedStartBuild = debounce(startBuild, 200);

// Watch for changes in server files
watch('src/server', { recursive: true }, (eventType, filename) => {
  console.log(`Server file changed: ${filename}`);
  debouncedStartServer();
});

// Watch for changes in client files
watch('src/app', { recursive: true }, (eventType, filename) => {
  console.log(`Client file changed: ${filename}`);
  debouncedStartBuild();
});

// Start the initial server
startBuild();

