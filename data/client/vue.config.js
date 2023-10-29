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
  chainWebpack: (config) => {
    /* disable insertion of assets as data urls b/c Phaser doesn't support it */
    const rules = ["images", "media"];

    rules.forEach((rule) => {
      const ruleConf = config.module.rule(rule);
      ruleConf.type("asset/resource");
    });
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
