const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.gltf$/,
        loader: "file-loader",
        options: {
          emitFile: true,
          outputPath: "assets",
          name: "[name].[ext]",
        },
      },
    ],
  },
  devServer: {
    client: {
      overlay: {
        warnings: false,
        errors: false,
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
}
