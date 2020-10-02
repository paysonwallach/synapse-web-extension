const path = require("path");

module.exports = {
  entry: {
    background_scripts: path.resolve(__dirname, "source", "background.js"),
  },
  mode: "production",
  output: {
    path: path.resolve(__dirname, "distribution"),
    filename: "background.js",
  },
};
