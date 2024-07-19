import { defineConfig } from 'vite'
import path from 'path'
import react from "@vitejs/plugin-react-swc";
import swc from "unplugin-swc";
import config from "./swc.ts"
import {browserslistToTargets} from 'lightningcss';
import browserslist from 'browserslist';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({}),
    swc.vite({ jsc:config.jsc }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        //server: path.resolve(__dirname, 'src/renderer.ts'),
      },
      output: {
        format: 'esm',
        entryFileNames: '[name].js',
      },
      //external: ['fsevents'],
    },
    cssMinify: 'lightningcss'
  },
  // css: {
  //   transformer: 'lightningcss',
  //   lightningcss: {
  //     targets: browserslistToTargets(browserslist())
  //   }
  // },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       // additionalData: `@import "./src/styles/variables.scss";` // Optional: to import global variables, mixins, etc.
  //     }
  //   }
  // }
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, 'src'),
  //   },
  // },
});
