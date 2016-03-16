'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.createMasterStore = createMasterStore;
exports.createReducer = createReducer;

var _fluxury = require('fluxury');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function isMappedObject() {
  for (var _len = arguments.length, input = Array(_len), _key = 0; _key < _len; _key++) {
    input[_key] = arguments[_key];
  }

  return input.length === 1 && _typeof(input[0]) === 'object' && typeof input[0].getState === 'undefined';
}

function _getState(isMapped) {
  for (var _len2 = arguments.length, input = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    input[_key2 - 1] = arguments[_key2];
  }

  if (isMappedObject.apply(undefined, input)) {
    return Object.keys(input[0]).reduce(function (acc, key) {
      acc[key] = input[0][key].getState();
      return acc;
    }, {});
  }

  return input.map(function (n) {
    return n.getState();
  });
}

function getStores(isMapped) {
  for (var _len3 = arguments.length, input = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    input[_key3 - 1] = arguments[_key3];
  }

  if (isMapped) {
    return Object.keys(input[0]).reduce(function (acc, key) {
      return acc.concat(input[0][key]);
    }, []);
  } else {
    input.forEach(function (store) {
      if (typeof store.getState !== 'function') {
        if (console && console.log) {
          console.log('ERROR: invalid store');
        }
      }
    });
    return input;
  }
}

function createMasterStore() {
  for (var _len4 = arguments.length, input = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    input[_key4] = arguments[_key4];
  }

  var isMapped = isMappedObject.apply(undefined, input);
  var defaultState = _getState.apply(undefined, [isMapped].concat(input));
  var stores = getStores.apply(undefined, [isMapped].concat(input));

  var dispatchTokens = stores.map(function (n) {
    return n.dispatchToken;
  });

  return (0, _fluxury.createStore)('Master Store', defaultState, function () {
    var state = arguments.length <= 0 || arguments[0] === undefined ? defaultState : arguments[0];
    var action = arguments[1];
    var waitFor = arguments[2];


    waitFor(dispatchTokens);

    var newState = _getState.apply(undefined, [isMapped].concat(input));

    if (isMapped) {

      if (Object.keys(input[0]).reduce(function (current, key) {
        return current && state[key] === newState[key];
      }, true)) {
        return state;
      }
    } else {

      // not changed
      if (state.length === newState.length && state.every(function (n, i) {
        return n === newState[i];
      })) {
        return state;
      }
    }

    return newState;
  }, {
    getState: function getState(state) {
      return _getState.apply(undefined, [isMapped].concat(_toConsumableArray(state)));
    }
  });
}

function createReducer() {
  for (var _len5 = arguments.length, input = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    input[_key5] = arguments[_key5];
  }

  var isMapped = isMappedObject.apply(undefined, input);
  var store = createMasterStore.apply(undefined, input);
  var stores = getStores.apply(undefined, [isMapped].concat(input));

  return function () {
    var state = arguments.length <= 0 || arguments[0] === undefined ? store.getState() : arguments[0];
    var action = arguments[1];


    // Replace the state to ensure nobody is out of sync
    if (isMapped) {
      Object.keys(input[0]).forEach(function (key) {
        input[0][key].replaceState(state[key]);
      });
    } else {
      stores.forEach(function (store, i) {
        return store.replaceState(state[i]);
      });
    }

    // run the action against the stores
    (0, _fluxury.dispatch)(action);

    // return the next state
    return store.getState();
  };
}
