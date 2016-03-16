var test = require('tape');

test('compose redux reducer from fluxury stores', function(t) {

  var createStore = require('fluxury').createStore
  var createReducer = require('./lib/index').createReducer
  var createReduxStore = require('redux').createStore

  t.plan(6)

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

  // creating store with initial state works too!
  var store = createReduxStore( reducer, [ [ 'Test Message' ], 100 ])

  t.deepEqual( store.getState(), [ [ 'Test Message' ], 100 ])

  store.dispatch( { type: 'loadMessage', data: 'Another message'} )

  t.deepEqual( store.getState(), [ [ 'Test Message', 'Another message' ], 101 ])

})


test('compose redux reducer from fluxury stores', function(t) {

  var createStore = require('fluxury').createStore
  var createReducer = require('./lib/index').createReducer
  var createReduxStore = require('redux').createStore

  t.plan(1)

  var MessageStore = createStore(
    'MessageStore',
    [],
    {
      loadMessage: function(state, data) {
        return state.concat(data)
      }
    })

  var MessageCountStore = createStore(
    'MessageCountStore',
    0,
    {
      loadMessage: function(state, data, waitFor) {
        waitFor([MessageStore.dispatchToken])
        return state+1
      }
    }
  )

  var reducer = createReducer({
    messages: MessageStore,
    count: MessageCountStore
  })

  var store = createReduxStore( reducer )

  store.dispatch( { type: 'loadMessage', data: 'Test Message'} )
  t.deepEqual( store.getState(), { messages: ['Test Message'], count: 1 } )

})


test('create master store from fluxury stores', function(t) {

  // Single-store concept without Redux
  var createStore = require('fluxury').createStore
  var dispatch = require('fluxury').dispatch
  var createMasterStore = require('./lib/index').createMasterStore

  t.plan(1)

  var MessageStore = createStore(
    'MessageStore',
    [],
    {
      loadMessage: function(state, data) {
        return state.concat(data)
      }
    })

  var MessageCountStore = createStore(
    'MessageCountStore',
    0,
    {
      loadMessage: function(state, data, waitFor) {
        waitFor([MessageStore.dispatchToken])
        return state+1
      }
    }
  )

  var store = createMasterStore( MessageCountStore, MessageStore )

  dispatch('loadMessage', 'Test Message' )

  t.deepEqual( store.getState(), [ 1, [ 'Test Message' ]])

})


test('create master store from fluxury stores', function(t) {

  // Single-store concept without Redux
  var createStore = require('fluxury').createStore
  var dispatch = require('fluxury').dispatch
  var createMasterStore = require('./lib/index').createMasterStore

  t.plan(1)

  var MessageStore = createStore(
    'MessageStore',
    [],
    {
      loadMessage: function(state, data) {
        return state.concat(data)
      }
    })

  var MessageCountStore = createStore(
    'MessageCountStore',
    0,
    {
      loadMessage: function(state, data, waitFor) {
        waitFor([MessageStore.dispatchToken])
        return state+1
      }
    }
  )

  var store = createMasterStore({
    messages: MessageStore,
    count: MessageCountStore
  })

  dispatch('loadMessage', 'Test Message' )

  t.deepEqual( store.getState(), { messages: ['Test Message'], count: 1 } )

})
