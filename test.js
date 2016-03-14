var test = require('tape');

test('compose redux reducer from fluxury stores', function(t) {

  var createStore = require('fluxury').createStore
  var createReducer = require('./lib/index').createReducer
  var createReduxStore = require('redux').createStore
  var dispatch = require('fluxury').dispatch
  var dispatchCount = 0;

  t.plan(4)

  var MessageStore = createStore('MessageStore', [], function(state, action) {
    switch(action.type) {
      case 'loadMessage':
      return state.concat(action.data)
      default:
      return state
    }
  })

  var MessageCountStore = createStore(
    'MessageCountStore',
    0,
    function(state, action, waitFor) {
      // ensure that MessageStore reducer is executed before continuing
      waitFor([MessageStore.dispatchToken])
      switch(action.type) {
        case 'loadMessage':
        return state+1
        default:
        return state
      }
    }
  )

  var reducer = createReducer(MessageStore, MessageCountStore)
  var store = createReduxStore( reducer )

  store.dispatch( { type: 'loadMessage', data: 'Test Message'} )

  t.deepEqual( store.getState(), [ [ 'Test Message' ], 1 ])

  store.dispatch( { type: 'loadMessage', data: 'Test Message 2'} )

  t.deepEqual( store.getState(), [ [ 'Test Message', 'Test Message 2' ], 2 ])

  store.dispatch( { type: 'noHandler', data: 'Test Message 2'} )

  t.deepEqual( store.getState(), [ [ 'Test Message', 'Test Message 2' ], 2 ])

  store.dispatch( { type: 'loadMessage', data: 'Test Message 3'} )

  t.deepEqual( store.getState(), [ [ 'Test Message', 'Test Message 2', 'Test Message 3' ], 3 ])

})
