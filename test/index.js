const Colors = require('./colors');
const Copy = require('./copy');
const Console = require('./Console');

module.exports = {
  ...Colors,
  ...Copy,

  Console,

  _testInternals: undefined,
};
