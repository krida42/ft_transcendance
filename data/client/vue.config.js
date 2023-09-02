const { defineConfig } = require("@vue/cli-service");
const WebpackShellPluginNext = require("webpack-shell-plugin-next");

module.exports = defineConfig({
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
