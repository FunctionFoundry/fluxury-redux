'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.createMasterStore = createMasterStore;
exports.createReducer = createReducer;

var _fluxury = require('fluxury');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function createMasterStore() {
  for (var _len = arguments.length, stores = Array(_len), _key = 0; _key < _len; _key++) {
    stores[_key] = arguments[_key];
  }

  var dispatchTokens = stores.map(function (n) {
    return n.dispatchToken;
  });
  var defaultState = stores.map(function (n) {
    return n.getState();
  });

  return (0, _fluxury.createStore)('StoreStore', defaultState, function (state, action, waitFor) {

    waitFor(dispatchTokens);

    var newState = stores.map(function (n) {
      return n.getState();
    });

    // not changed
    if (state.length === newState.length && state.every(function (n, i) {
      return n === newState[i];
    })) {
      return state;
    }

    return newState;
  });
}

function createReducer() {
  for (var _len2 = arguments.length, input = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    input[_key2] = arguments[_key2];
  }

  var stores = void 0,
      store = void 0,
      mode = 'array';

  if (input.length === 1 && _typeof(input[0]) === 'object' && typeof input[0].getState === 'undefined') {
    stores = Object.keys(input[0]).reduce(function (acc, key) {
      return acc.concat(input[0][key]);
    }, []);
    mode = 'object';
  } else {
    stores = input;
  }

  store = createMasterStore.apply(undefined, _toConsumableArray(stores));

  return function (state, action) {

    if (typeof state === 'undefined') {
      return stores.map(function (n) {
        return n.getState();
      });
    }

    // run the action against the stores
    (0, _fluxury.dispatch)(action);

    if (mode === 'object') {
      return Object.keys(input[0]).reduce(function (acc, key) {
        acc[key] = input[0][key].getState();
        return acc;
      }, {});
    }

    // return the next state
    return store.getState();
  };
}
