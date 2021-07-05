const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const SizePlugin = require("size-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const WextManifestWebpackPlugin = require("wext-manifest-webpack-plugin");

const dataPath = path.join(__dirname, "data");
const destPath = path.join(__dirname, "distribution");
const sourcePath = path.join(__dirname, "source");
const targetBrowser = process.env.TARGET_BROWSER;

module.exports = {
  devtool: false, // https://github.com/webpack/webpack/issues/1194#issuecomment-560382342
  stats: {
    all: false,
    builtAt: true,
    errors: true,
    hash: true,
  },
  entry: {
    manifest: path.join(dataPath, "manifest.json"),
    background: path.join(sourcePath, "background.js"),
  },
  output: {
    path: path.join(destPath, targetBrowser),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        type: "javascript/auto", // prevent webpack handling json with its own loaders,
        test: /manifest\.json$/,
        use: {
          loader: "wext-manifest-loader",
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new SizePlugin(),
    new WextManifestWebpackPlugin(),
    new webpack.SourceMapDevToolPlugin({ filename: false }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "*.svg",
          context: "data",
        },
        {
          from: "**/*",
          context: "source",
        },
        {
          from: "node_modules/webextension-polyfill/dist/browser-polyfill.min.js",
        },
      ],
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: false,
          compress: false,
          output: {
            beautify: true,
            indent_level: 2, // eslint-disable-line camelcase
          },
        },
      }),
    ],
  },
};
