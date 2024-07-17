import { defineConfig } from 'vite'
import path from 'path'
import react from "@vitejs/plugin-react-swc";
import swc from "unplugin-swc";
import config from "./swc.ts"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({}),
    swc.vite({ jsc:config.jsc }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/app/index.html'),
        server: path.resolve(__dirname, 'src/server/renderer.tsx'),
      },
      output: {
        format: 'esm',
        entryFileNames: '[name].js',
      },
      //external: ['fsevents'],
    },
  },
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, 'src'),
  //   },
  // },
});
