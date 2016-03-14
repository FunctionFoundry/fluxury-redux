import { createStore, dispatch } from 'fluxury'

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
