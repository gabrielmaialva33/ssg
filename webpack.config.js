const path = require("path")
const webpack = require("webpack")
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".js", ".ts"],
    fallback: {
      fs: false,
      path: require.resolve("path-browserify"),
      net: false,
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer/"),
      os: require.resolve("os-browserify/browser"),
      util: require.resolve("util/"),
      assert: false,
      constants: false
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
      crypto: ["crypto-browserify", "crypto"]
    }),
    new webpack.DefinePlugin({
      global: "window"
    }),
    new NodePolyfillPlugin()
  ],
  mode: process.env.NODE_ENV ?? "development"
}
