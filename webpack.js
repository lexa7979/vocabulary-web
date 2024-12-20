const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const { babel: BabelConfig } = require('./package.json');

module.exports = {
  getTransformationRules,
  getOutputOptions,
  getWatchOptions,
  getConsoleLogOptions,
  getCacheOptions,
  getDevServerOptions,
};

/**
 * @typedef IOptionsBag
 * @prop {boolean} [contextIsNode]
 * @prop {string} [subDir]
 * @prop {boolean} [isDevMode]
 * @prop {boolean} [isWatchMode]
 */

/** @param {IOptionsBag} optionsBag */
function getTransformationRules({ contextIsNode }) {
  const MAGIC_EXTENSIONS_IF_OMITTED_WITH_IMPORT = ['.js', '.jsx', '.json'];

  const _ignoreWithNode = data => (contextIsNode ? 'null-loader' : data);

  return {
    plugins: [new MiniCssExtractPlugin(), new HtmlWebpackPlugin({ template: './src/index.html' })],
    resolve: {
      extensions: MAGIC_EXTENSIONS_IF_OMITTED_WITH_IMPORT,
    },
    target: contextIsNode ? 'node' : 'browserslist:> 0.25%, not dead',
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: BabelConfig,
          },
        },
        {
          test: /\.s?css$/i,
          use: _ignoreWithNode([MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']),
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: _ignoreWithNode([
            {
              loader: 'file-loader',
              options: {
                // publicPath: composePublicPathString(isDevMode, ['static', subDir]),
                name: '[name].[hash:8].[ext]',
                outputPath: 'images',
              },
            },
          ]),
        },
        {
          test: /\.(ttf|woff|woff2|otf)$/,
          use: _ignoreWithNode([
            {
              loader: 'file-loader',
              options: {
                name: '[name].[hash:8].[ext]',
                outputPath: 'fonts',
              },
            },
          ]),
        },
      ],
    },
  };
}

/** @param {IOptionsBag} optionsBag */
function getOutputOptions({ contextIsNode, subDir, isDevMode }) {
  const OUTPUT_LICENSE_FILES = false;
  const BUNDLES_CAN_BE_IMPORTED_ON_SERVER_SIDE = contextIsNode
    ? { library: { type: 'commonjs2' } }
    : null;

  // There are many different types of source-maps in Webpack
  // (see https://webpack.js.org/configuration/devtool)

  // Tested settings:

  // const DEV_SOURCE_MAP_TYPE = 'eval'
  // - comes w/o *.map files and still small bundle (app.js has 2.6 MB)
  // - code view with many Webpack annotations when debugging in browser
  // - first build-dev (i.e. with empty cache) took 17 seconds

  // const DEV_SOURCE_MAP_TYPE = 'eval-cheap-module-source-map'
  // - comes w/o *.map files, has bigger bundles instead (app.js has 6.0 MB)
  // - code view with many Webpack annotations when debugging in browser
  // - first build-dev (i.e. with empty cache) took 13 seconds

  const DEV_SOURCE_MAP_TYPE = 'source-map';
  // - comes with *.map files (app.js has 2.5 MB)
  // - full code view when debugging in browser
  // - first build-dev (i.e. with empty cache) took 18 seconds

  // const DEV_SOURCE_MAP_TYPE = 'inline-source-map'
  // - comes w/o *.map files, has bigger bundles instead (app.js has 6.1 MB)
  // - full code view when debugging in browser
  // - first build-dev (i.e. with empty cache) took 22 seconds

  return {
    optimization: isDevMode
      ? undefined
      : {
          minimizer: [new TerserPlugin({ extractComments: OUTPUT_LICENSE_FILES })],
        },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist', subDir || ''),
      // publicPath: composePublicPathString(isDevMode, ['static', subDir]),
      ...BUNDLES_CAN_BE_IMPORTED_ON_SERVER_SIDE,
    },
    devtool: isDevMode ? DEV_SOURCE_MAP_TYPE : undefined,
  };
}

/** @param {IOptionsBag} optionsBag */
function getWatchOptions({ isWatchMode }) {
  if (isWatchMode) {
    return {
      watch: true,
      watchOptions: {
        aggregateTimeout: 3000,
        ignored: /\bnode_modules\b/,
      },
    };
  }

  return {
    watch: false,
  };
}

/** @param {IOptionsBag} optionsBag */
function getConsoleLogOptions({ contextIsNode, isDevMode, isWatchMode }) {
  return {
    performance: {
      hints: contextIsNode || isDevMode ? false : 'warning',
    },
    stats: {
      all: false,
      colors: true,

      errors: true,
      errorDetails: 'auto',
      warnings: true,

      // publicPath: !isWatchMode,
      assets: !isWatchMode,

      builtAt: true,
      version: true,
      timings: true,
    },
  };
}

/** @param {IOptionsBag} optionsBag */
function getCacheOptions({ contextIsNode, isDevMode }) {
  const IGNORE_CACHE_ON_CHANGED_WEBPACK_CONFIG = { config: [__filename] };

  return isDevMode
    ? {
        cache: {
          name: contextIsNode ? 'node' : 'browser',
          type: 'filesystem',
          buildDependencies: { ...IGNORE_CACHE_ON_CHANGED_WEBPACK_CONFIG },
        },
      }
    : null;
}

/** @param {IOptionsBag} optionsBag */
function getDevServerOptions({}) {
  const OPEN_BROWSER_ON_SERVE = true;
  const REFRESH_BROWSER_ON_SERVE = true;
  const SERVE_SUBPATHS_AS_ROOT = true;

  const _before = app => {
    app.use(cookieParser());
    app.use(session({ secret: 'glosförhör session secret' }));
  };

  return {
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      historyApiFallback: SERVE_SUBPATHS_AS_ROOT,
      watchContentBase: REFRESH_BROWSER_ON_SERVE,
      writeToDisk: true,
      proxy: { '/api': 'http://localhost:4001' },
      before: _before,
      open: OPEN_BROWSER_ON_SERVE,
    },
  };
}

function composePublicPathString(isDevMode, subDirParts) {
  const allParts = [
    isDevMode ? `http://localhost:3000` : '',
    ...subDirParts.filter(text => typeof text === 'string' && text !== ''),
  ];
  return `${allParts.map(text => text.replace(/^\/|\/$/g, '')).join('/')}/`;
}
