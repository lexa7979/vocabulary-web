const Colors = require('./colors');
const Copy = require('./copy');

module.exports = {
  ...Colors,
  ...Copy,

  _testInternals: undefined,
};
