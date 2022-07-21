const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const cookieParser = require('cookie-parser');
const session = require('express-session');

const { babel: BabelConfig } = require('./package.json');

const ENV_IS_DEV = ['dev', 'development'].includes(process.env.WEBPACK_ENV);
const WATCH_IS_ON = process.env.WEBPACK_MODE === 'watch';

module.exports = [
  {
    entry: {
      glosfoerhoer: './src/App.jsx',
    },
    mode: ENV_IS_DEV ? 'development' : 'production',

    ...getTransformationRules(),
    ...getOutputOptions(),

    ...getWatchOptions(),
    ...getConsoleLogOptions(),
    ...getCacheOptions(),

    ...getDevServerOptions(),
  },
];

function getTransformationRules(inputBag) {
  // const { contextIsNode, subDir } = inputBag || {};
  const { contextIsNode } = inputBag || {};

  const MAGIC_EXTENSIONS_IF_OMITTED_WITH_IMPORT = ['.js', '.jsx', '.json'];

  const _ignoreWithNode = data => (contextIsNode ? 'null-loader' : data);

  return {
    // @ts-ignore
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
                // publicPath: composePublicPathString('static', subDir),
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

function getOutputOptions(inputBag) {
  const { contextIsNode, subDir } = inputBag || { subDir: null };

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
    optimization: ENV_IS_DEV
      ? undefined
      : {
          minimizer: [new TerserPlugin({ extractComments: OUTPUT_LICENSE_FILES })],
        },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist', subDir || ''),
      // publicPath: composePublicPathString('static', subDir),
      ...BUNDLES_CAN_BE_IMPORTED_ON_SERVER_SIDE,
    },
    devtool: ENV_IS_DEV ? DEV_SOURCE_MAP_TYPE : undefined,
  };
}

function getWatchOptions() {
  if (WATCH_IS_ON) {
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

function getConsoleLogOptions(inputBag) {
  const { contextIsNode } = inputBag || {};

  return {
    performance: {
      hints: contextIsNode || ENV_IS_DEV ? false : 'warning',
    },
    stats: {
      all: false,
      colors: true,

      errors: true,
      errorDetails: 'auto',
      warnings: true,

      // publicPath: !WATCH_IS_ON,
      assets: !WATCH_IS_ON,

      builtAt: true,
      version: true,
      timings: true,
    },
  };
}

function getCacheOptions(inputBag) {
  const { contextIsNode } = inputBag || {};

  const IGNORE_CACHE_ON_CHANGED_WEBPACK_CONFIG = { config: [__filename] };

  return ENV_IS_DEV
    ? {
        cache: {
          name: contextIsNode ? 'node' : 'browser',
          type: 'filesystem',
          buildDependencies: { ...IGNORE_CACHE_ON_CHANGED_WEBPACK_CONFIG },
        },
      }
    : null;
}

function getDevServerOptions() {
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

function composePublicPathString(...subDirParts) {
  const allParts = [
    ENV_IS_DEV ? `http://localhost:3000` : '',
    ...subDirParts.filter(text => typeof text === 'string' && text !== ''),
  ];
  return `${allParts.map(text => text.replace(/^\/|\/$/g, '')).join('/')}/`;
}
