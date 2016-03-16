import { createStore, dispatch } from 'fluxury'

export function createMasterStore(...stores) {

  let dispatchTokens = stores.map(n => n.dispatchToken )
  let defaultState = stores.map(n => n.getState())

  return createStore(
    'StoreStore',
    defaultState,
    (state, action, waitFor) => {

      waitFor(dispatchTokens)

      let newState = stores.map( n => n.getState() )

      // not changed
      if (
        state.length === newState.length &&
        state.every( (n, i) => n === newState[i] )
      ) {
        return state
      }

      return newState

    }
  )

}

export function createReducer(...input) {

  let stores,
  store,
  mode = 'array'

  if (input.length === 1 &&
    typeof input[0] === 'object' &&
    typeof input[0].getState === 'undefined') {
      stores = Object.keys(input[0]).reduce((acc, key) => acc.concat(input[0][key]), [])
      mode = 'object'
  } else {
    stores = input
  }

  store = createMasterStore(...stores)

  return (state, action) => {

    if (typeof state === 'undefined') {
      return stores.map(n => n.getState())
    }

    // run the action against the stores
    dispatch(action)

    if ( mode === 'object') {
      return Object.keys(input[0]).reduce((acc, key) => {
        acc[key] = input[0][key].getState()
        return acc;
      }, {})
    }

    // return the next state
    return store.getState()
  }
}
