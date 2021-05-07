const DEFAULT_REPLACE_ACTIONS = { replaceFunctions: _replaceIfFunction };

const Global = {
  replaceActions: { ...DEFAULT_REPLACE_ACTIONS },
  mockupProps: [],
};

module.exports = {
  copyObject,
  registerReplaceAction,

  _testInternals: {
    listReplaceActions() {
      return Global.replaceActions;
    },
    resetReplaceActions() {
      Global.replaceActions = { ...DEFAULT_REPLACE_ACTIONS };
    },
  },
};

function registerReplaceAction(optionName, callback) {
  if (typeof optionName !== 'string' || optionName === '') {
    throw new Error('registerReplaceAction() failed - invalid argument "optionName"');
  }
  if (typeof callback !== 'function') {
    throw new Error('registerReplaceAction() failed - invalid argument "callback"');
  }
  if (Global.replaceActions[optionName] == null) {
    Global.replaceActions[optionName] = callback;
    return true;
  }
  return false;
}

/**
 * @param {*} input
 * @param {object} [optionsBag]
 *    Set options to true in order to activate the related replace-action.
 *    This options are supported by default:
 *    - { replaceFunctions: true }
 *      replace any contained function or mockup with a string-description
 *    Some additional options might have been added with help of registerReplaceAction()
 *
 *    Beside of all this:
 *    - { replaceAllSpecials: true }
 *      can be set to true if every registered replace-action shall be used
 *      when recursively processing the input.
 *
 * @returns {*}
 * @throws
 */
function copyObject(input, optionsBag = {}) {
  const _options = optionsBag || {};

  const _replaceActionsWithNonObjects = [];
  if (_options.replaceAllSpecials) {
    _replaceActionsWithNonObjects.push(...Object.values(Global.replaceActions));
  } else {
    Object.keys(_options).forEach(key => {
      if (typeof Global.replaceActions[key] === 'function') {
        _replaceActionsWithNonObjects.push(Global.replaceActions[key]);
      } else {
        throw new Error(`copyObject() failed - unknown option "${key}"`);
      }
    });
  }

  if (input instanceof Promise) {
    throw new Error("copyObject() failed - won't process a Promise");
  }

  const _deepCopy = (obj, path) => {
    if (path.includes(obj)) {
      return '(circular)';
    }
    const _path = [...path, obj];

    if (Array.isArray(obj)) {
      return obj.map(item => _deepCopy(item, _path));
    }

    if (obj != null && typeof obj === 'object') {
      const result = {};
      Object.keys(obj).forEach(key => {
        result[key] = _deepCopy(obj[key], _path);
      });
      return result;
    }

    return _replaceActionsWithNonObjects.reduce(
      (result, callback) => callback(result, { _recursion: _deepCopy, _path }),
      obj
    );
  };

  return _deepCopy(input, []);
}

function _replaceIfFunction(value, { _recursion, _path }) {
  if (typeof value !== 'function') {
    return value;
  }

  let self;

  const _isMockup = value.mock != null && typeof value.mock === 'object';
  if (_isMockup) {
    const l = value.mock.calls.length;
    self = `(MOCK:${l} call${l === 1 ? '' : 's'})`;
  } else {
    self = `(FUNC:${value.name || 'anonymous'})`;
  }

  if (Global.mockupProps.length === 0) {
    Global.mockupProps = Object.keys(jest.fn());
  }
  const funcProps = _isMockup
    ? Object.keys(value).filter(key => !Global.mockupProps.includes(key))
    : Object.keys(value);

  if (funcProps.length > 0) {
    const result = { _self: self, props: {} };
    funcProps.forEach(key => {
      result.props[key] = _recursion(value[key], _path);
    });
    return result;
  }

  return self;
}
