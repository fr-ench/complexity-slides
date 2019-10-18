const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const env = process.env.NODE_ENV;

module.exports = {
  mode: env || 'development',
  entry:  {
    app: `./src/app.js`,
  },
  output: {
    path: `${__dirname}/dist`,
    publicPath: 'dist/',
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash].js',
  },
  resolve: {
    modules: ['./src', 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: true,
            },
          },
          {
            loader: 'eslint-loader',
          }
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 32768,
            },
          }
        ],
      }
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      { from: './src/assets', to: './assets' }
    ])
  ],
  devServer: {
    hot : true,
    publicPath: '/dist',
    historyApiFallback: {
      index: '/index.html',
    },
    port: 1315,
    headers : {
      'Access-Control-Allow-Origin' : 'http://localhost:1310',
      'Access-Control-Allow-Credentials' : 'true',
    },
  },
}
