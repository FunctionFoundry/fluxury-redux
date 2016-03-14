# fluxury-redux

Compose Fluxury stores into a Redux reducer.

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
