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

    // replace the state in the fluxury stores with the redux state
    stores.forEach((store, i) => {
      store.replaceState(state[i])
    })

    // run the action against the stores
    dispatch(action)

    // return the next state
    return StoreStore.getState()
  }
}
