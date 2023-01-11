const { resolve } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = (env) => {
  const config = {
    entry: './src/client/index.js',
    module: {
      rules: [
        {
          test: /\.(mp3)$/i,
          use: {
            loader: 'file-loader'
          }
        }
      ]
    },
    mode: env.production ? 'production' : 'development',
    output: {
      filename: 'index.js',
      path: resolve(__dirname, 'build')
    },
    plugins: [
      new CleanWebpackPlugin(),
    ],
  }

  return config;
}