const merge = require('webpack-merge').default;
const express = require('express');
const path = require('path');
const common = require('./webpack.common.js');

require('dotenv').config();

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    watchContentBase: true,
    port: process.env.PORT,
    before(app) {
      app.use('/images', express.static(path.resolve('images')));
    },
  },
});
