const {
  getTransformationRules,
  getOutputOptions,
  getWatchOptions,
  getConsoleLogOptions,
  getCacheOptions,
  getDevServerOptions,
} = require('./webpack.js');

const options = {
  contextIsNode: false,
  isDevMode: ['dev', 'development'].includes(process.env.WEBPACK_ENV),
  isWatchMode: process.env.WEBPACK_MODE === 'watch',
};

module.exports = [
  {
    entry: {
      glosfoerhoer: './src/App.jsx',
    },
    mode: options.isDevMode ? 'development' : 'production',

    ...getTransformationRules(options),
    ...getOutputOptions(options),

    ...getWatchOptions(options),
    ...getConsoleLogOptions(options),
    ...getCacheOptions(options),

    ...getDevServerOptions(options),
  },
];
