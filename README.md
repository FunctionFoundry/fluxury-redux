# fluxury-redux

Compose Fluxury stores into a Redux reducer. This integrates the Facebook dispatcher with the single store concept in Redux. Internally it implements a Fluxury store that updates when any of the Fluxury stores that it tracks changes. I named it StoreStore.

This lets you use the Facebook style "waitFor" to enforce the order to execute the store handlers. The final result packaged into an array with an item for the state of each store.

Redux has done a lot to promote function programming and this library will enable you to use Fluxury in combination with the rich ecosystem developing around redux.

Integrate Fluxury with the Redux ecosystem.

```js
const createFluxStore = require('fluxury').createStore,
createStore = require('redux'),
createReducer = require('fluxury-redux')

todosStore = createFluxStore('TodosStore', [], {
  setTodo: (state, data) => {
    var newState = state.map(n => n)
    newState[data.id] = data
    return newState
  },
  markDone: (state, data) => state.map(n =>
    n.id === data ?
    Object.assign({}, n, { done: true}) : n),
  trashTodo: (state, data) => state.map(n =>
    n.id === data ?
    Object.assign({}, n, { __trash: true}) : n)
})

var store = createStore( createReducer(todosStore) )
```
