module.exports = {
  green,
  IS_ACCESSIBLE: green('is accessible'),
  EXPECTS: green('expects'),
  WORKS: green('works'),
  SENDS: green('sends'),
  DELIVERS: green('delivers'),
  RETURNS: green('returns'),
  RESOLVES: green('resolves'),

  red,
  FAILS: red('FAILS'),
  REJECTS: red('REJECTS'),

  bold,
  ASYNC: bold('async'),
};

function green(text) {
  return `\x1b[0;32m${text}\x1b[0m`;
}

function red(text) {
  return `\x1b[1;31m${text}\x1b[0m`;
}

function bold(text) {
  return `\x1b[1;37m${text}\x1b[0m`;
}
