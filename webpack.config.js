module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      "window.jQuery": "jquery",
      jQuery: "jquery",
    }),
  ],
};
