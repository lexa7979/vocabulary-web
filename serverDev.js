/* eslint-disable import/no-extraneous-dependencies,no-console */

const path = require('path');

const express = require('express');
const session = require('express-session');
const webpack = require('webpack');

require('dotenv').config();

const webpackConfig = require('./webpack.config');

initServerAsync();

async function initServerAsync() {
  console.log('Bundling source code');

  const result = await bundleWithWebpack();

  const { compilation } = result.stats[0];
  // eslint-disable-next-line no-unused-vars
  const { errors, warnings } = compilation;

  // console.log({ keys: Object.keys(compilation) });
  console.log('... ready', { errors });

  console.log('Starting web-server');

  const app = express();

  app.use(
    session({
      secret: process.env.GLOSFOERHOER_SESSION_KEY,
      resave: false,
      saveUninitialized: false,
    })
  );

  app.use(({ method, url }, res, next) => {
    console.log('Got request', { method, url });
    next();
  });

  app.use(express.static('dist'));
  app.get('/**/*.js', (req, res) => {
    const { url } = req;
    res.sendFile(path.resolve(__dirname, 'dist', path.basename(url)));
  });
  app.get('/*', (req, res) => res.sendFile(path.resolve(__dirname, 'dist/index.html')));

  console.log('... ready on http://localhost:3000');

  app.listen(3000);
}

async function bundleWithWebpack() {
  const compiler = webpack(webpackConfig);

  const result = new Promise((resolve, reject) =>
    compiler.run((error, stats) => {
      if (error) {
        reject(error);
      } else {
        resolve(stats);
      }
    })
  );

  return result;
}
