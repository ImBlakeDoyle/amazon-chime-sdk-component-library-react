// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const path = require('path');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const app = 'index';

module.exports = {
  mode: 'development',
  entry: ['./src/index.js'],
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.jsx', '.tsx', '.ts', '.js'],
    alias: {
      react: path.resolve('./node_modules/react'),
      'styled-components': path.resolve('../../node_modules/styled-components'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      'amazon-chime-sdk-component-library-react': path.resolve(
        __dirname,
        '../../src/index.ts'
      ),
    },
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: `${app}-bundle.js`,
    publicPath: '/',
    libraryTarget: 'var',
    library: `app_${app}`,
  },
  node: {
    fs: 'empty',
    tls: 'empty',
  },
  plugins: [
    new HtmlWebpackPlugin({
      inlineSource: '.(js|css)$',
      template: __dirname + `/app/${app}.html`,
      filename: __dirname + `/dist/${app}.html`,
      inject: 'head',
    }),
    new HtmlWebpackInlineSourcePlugin(),
  ],
  devServer: {
    proxy: {
      '/': {
        target: 'http://localhost:8080',
        bypass: function (req, _res, _proxyOptions) {
          if (req.headers.accept.indexOf('html') !== -1) {
            console.log('Skipping proxy for browser request.');
            return `/${app}.html`;
          }
        },
      },
    },
    contentBase: path.join(__dirname, 'dist'),
    index: `${app}.html`,
    compress: true,
    liveReload: true,
    hot: false,
    host: '127.0.0.1',
    port: 9000,
    https: true,
    historyApiFallback: true,
    writeToDisk: true,
  },
};
