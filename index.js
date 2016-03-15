import { createStore, dispatch } from 'fluxury'
import { applyMiddleware, createStore as createReduxStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

export function createReducer(...stores) {

  let dispatchTokens = stores.map(n => n.dispatchToken )
  let defaultState = []

  let StoreStore = createStore( 'StoreStore', defaultState, (state, action, waitFor) => {

    waitFor(dispatchTokens)

    let newState = stores.map( n => n.getState() )

    let unChanged = (
      (state.length === newState.length) &&
      state.every( (n, i) => n === newState[i] )
    )

    if (unChanged) {
      return state
    }

    return newState

  })

  return (state=stores.map( n => n.getState() ), action) => {
    dispatch(action)
    return StoreStore.getState()
  }
}
let accept = './src/stores'
export function setStorePath(path) {
  accept = path
}

export function configureStore(...stores) {

  let rootReducer = createReducer(...stores);

  const logger = createLogger({
    collapsed: true,
    predicate: () =>
    process.env.NODE_ENV === `development`, // eslint-disable-line no-unused-vars
  });

  const middleware = applyMiddleware(thunkMiddleware, logger);
  const createStore2 = middleware(createReduxStore)
  const store = (window.devToolsExtension ? window.devToolsExtension()(createStore2) : createStore2)(rootReducer, []);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept(accept, () => {
      const nextRootReducer = createReducer(...stores);
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
