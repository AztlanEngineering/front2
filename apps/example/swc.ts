// import path from "path";

export default {
  jsc: {
    experimental: {
      plugins: [
        [
          "@swc/plugin-relay",
          {
            rootDir: __dirname,
            artifactDirectory: "src/__generated__",
            language: "typescript",
            eagerEsModules: true,
          },
        ],
        // // Or if you want to use multiple projects
        // [
        //   "@swc/plugin-relay",
        //   {
        //     projects: [
        //       {
        //         rootDir: path.resolve(__dirname, '../project1'),
        //       },
        //       {
        //         rootDir: path.resolve(__dirname, '../project2'),
        //       }
        //     ],
        //     language: "typescript",
        //     eagerEsModules: true,
        //   },
        // ],
      ],
    },
    parser: {
      syntax: "typescript",
      tsx: true,
    },
    transform: {
      react: {
        runtime: "automatic",
      },
    },
  },
};
