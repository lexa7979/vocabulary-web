const helpers = require('./webpack.js');

const options = {
  contextIsNode: false,
  isDevMode: true,
  isWatchMode: process.env.WEBPACK_MODE === 'watch',
};

module.exports = [
  {
    entry: {
      glosfoerhoer: './src/App.jsx',
    },
    mode: 'development',

    ...helpers.getTransformationRules(options),
    ...helpers.getOutputOptions(options),

    ...helpers.getWatchOptions(options),
    ...helpers.getConsoleLogOptions(options),
    ...helpers.getCacheOptions(options),

    ...helpers.getDevServerOptions(options),
  },
];
