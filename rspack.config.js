const { HtmlRspackPlugin } = require('@rspack/core');

module.exports = {
  entry: './src/index.js',
  devServer: {
    open: true,
  },
  plugins: [
    new HtmlRspackPlugin({
      template: './src/index.html',
    }),
  ],
};
