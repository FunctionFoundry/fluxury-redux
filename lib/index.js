'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createReducer = createReducer;

var _fluxury = require('fluxury');

function createReducer() {
  for (var _len = arguments.length, stores = Array(_len), _key = 0; _key < _len; _key++) {
    stores[_key] = arguments[_key];
  }

  var dispatchTokens = stores.map(function (n) {
    return n.dispatchToken;
  });
  var defaultState = [];

  var StoreStore = (0, _fluxury.createStore)('StoreStore', defaultState, function (state, action, waitFor) {

    waitFor(dispatchTokens);

    var newState = stores.map(function (n) {
      return n.getState();
    });

    var unChanged = state.length === newState.length && state.every(function (n, i) {
      return n === newState[i];
    });

    if (unChanged) {
      return state;
    }

    return newState;
  });

  return function () {
    var state = arguments.length <= 0 || arguments[0] === undefined ? stores.map(function (n) {
      return n.getState();
    }) : arguments[0];
    var action = arguments[1];

    (0, _fluxury.dispatch)(action);
    return StoreStore.getState();
  };
}
