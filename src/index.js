import { createStore, dispatch } from 'fluxury'

function isMappedObject(...input) {
  return (input.length === 1 &&
    typeof input[0] === 'object' &&
    typeof input[0].getState === 'undefined')
}

function getState(isMapped, ...input) {

  if (isMappedObject(...input)) {
    return Object.keys(input[0]).reduce((acc, key) => {
      acc[key] = input[0][key].getState()
      return acc;
    }, {})
  }

  return input.map(n => n.getState())
}

function getStores(isMapped, ...input) {
  if (isMapped) {
      return Object.keys(input[0]).reduce((acc, key) => acc.concat(input[0][key]), [])
  } else {
    input.forEach( store => {
      if (typeof store.getState !== 'function') {
        if (console && console.log) {
          console.log('ERROR: invalid store')
        }
      }
    })
    return input
  }
}

export function createMasterStore(...input) {
  let isMapped = isMappedObject(...input)
  let defaultState = getState(isMapped, ...input)
  let stores = getStores(isMapped, ...input)

  let dispatchTokens = stores.map(n => n.dispatchToken )

  return createStore(
    'Master Store',
    defaultState,
    (state=defaultState, action, waitFor) => {

      waitFor(dispatchTokens)

      let newState = getState(isMapped, ...input)

      if (isMapped){

        if ( Object.keys(input[0]).reduce(
          (current, key) =>
          (current && state[key] === newState[key]), true
        )) {
          return state;
        }

      } else {

        // not changed
        if (
          state.length === newState.length &&
          state.every( (n, i) => n === newState[i] )
        ) {
          return state
        }

      }

      return newState

    },
    {
      getState:(state) => getState(isMapped, ...state)
    }
  )

}

export function createReducer(...input) {

  let isMapped = isMappedObject(...input)
  let store = createMasterStore(...input)
  let stores = getStores(isMapped, ...input)

  return (state=store.getState(), action) => {

    // Replace the state in each store with whatever comes from Redux
    if (isMapped) {
      Object.keys(input[0]).forEach(
        key => {
          input[0][key].replaceState(state[key])
        }
      )
    } else {
      stores.forEach(
        (store, i) => store.replaceState(state[i])
      )
    }

    // run the action against the stores
    dispatch(action)

    // return the next state
    return store.getState()
  }
}
