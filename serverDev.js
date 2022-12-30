/* eslint-disable import/no-extraneous-dependencies,no-console */

const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');

const express = require('express');
const session = require('express-session');
const webpack = require('webpack');

require('dotenv').config();

const webpackConfig = require('./webpack.config');

(async function init() {
  await bundleWithWebpack();
  await startServer();
})();

async function bundleWithWebpack() {
  console.log('Bundling source code');

  // @ts-ignore
  const compiler = webpack(webpackConfig);

  const result = await new Promise((resolve, reject) =>
    compiler.run((error, stats) => {
      if (error) {
        reject(error);
      } else {
        resolve(stats);
      }
    })
  );

  const { compilation } = result.stats[0];
  // eslint-disable-next-line no-unused-vars
  const { errors, warnings } = compilation;

  if (warnings && warnings.length > 0) {
    console.log(`Got ${warnings.length} warning/s`, {
      warnings: warnings.map(item =>
        String(item)
          .split('\n')
          .filter(line => !/^\s*at\s/.test(line))
          .join('\n')
      ),
    });
  }

  console.log('... ready', { errors });
}

async function startServer() {
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

  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert.pem')),
  };
  http.createServer(app).listen(3000);
  https.createServer(httpsOptions, app).listen(4000);

  console.log('... ready on http://localhost:3000 and https://localhost:4000');
}
