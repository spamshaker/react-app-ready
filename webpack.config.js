const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;
const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';
const WebpackBar = require('webpackbar');
const fs = require('fs');
const host = require('node-fqdn')().toLowerCase() || 'localhost';
const config = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  stats: 'errors-only',
  devServer: {
    open: true,
    host,
    hot: 'only',
    // compress: true,
    // http2: true,
    client: {
      logging: 'info'
      // progress: true
    },
    devMiddleware: {
      index: true
      // writeToDisk: true
    },
    https: {
      minVersion: 'TLSv1.1',
      //key: path.join(__dirname, './server.key'),
      //cert: path.join(__dirname, './server.crt'),
      //requestCert: true
    }
  },
  target: 'web',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'React Application',
      templateContent: `<div id="root"></div>`
    }),
    new ReactRefreshWebpackPlugin({
      overlay: false
    }),
    new WebpackBar()
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
        options: {
          getCustomTransformers: () => ({
            before: [require('react-refresh-typescript')()]
          }),
          transpileOnly: isDevelopment
        }
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader']
      },
      {
        test: /\.less$/i,
        use: ['less-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};
module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
    config.plugins.push(new MiniCssExtractPlugin());
  } else {
    config.mode = 'development';
  }
  return config;
};
