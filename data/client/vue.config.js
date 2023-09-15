const { defineConfig } = require("@vue/cli-service");
const WebpackShellPluginNext = require("webpack-shell-plugin-next");

module.exports = defineConfig({
  // devServer: {
  //   proxy: "http://localhost:10533"
  // },
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "./config/dist/colors.scss";`,
      },
    },
  },
  configureWebpack: {
    plugins: [
      new WebpackShellPluginNext({
        onBuildStart: {
          scripts: ["node ./config/scripts/update-scss-variables.js"],
        },
      }),
    ],
  },
});
