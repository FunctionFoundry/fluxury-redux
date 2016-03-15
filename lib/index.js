'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createReducer = createReducer;

var _fluxury = require('fluxury');

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reduxLogger = require('redux-logger');

var _reduxLogger2 = _interopRequireDefault(_reduxLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createReducer() {
  for (var _len = arguments.length, stores = Array(_len), _key = 0; _key < _len; _key++) {
    stores[_key] = arguments[_key];
  }

  var first = true;
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

  return function (state, action) {

    if (first) {
      first = false;
    } else {
      // replace the state in the fluxury stores with the redux state
      stores.forEach(function (store, i) {
        store.replaceState(state[i]);
      });
    }

    // run the action against the stores
    (0, _fluxury.dispatch)(action);

    // return the next state
    return StoreStore.getState();
  };
}
