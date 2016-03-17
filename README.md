# fluxury-redux

[![Circle CI](https://circleci.com/gh/FunctionFoundry/fluxury-redux/tree/master.svg?style=svg)](https://circleci.com/gh/FunctionFoundry/fluxury-redux/tree/master)

## Quick Start

```sh
npm install --save fluxury fluxury-redux
```

```js
import { createReducer, createStore } from 'fluxury-redux'
```

## Summary

Redux-compatible reducer and compose stores into larger objects; built on [Fluxury](https://github.com/FunctionFoundry/fluxury).

Also, see the [React-Fluxury](https://github.com/FunctionFoundry/react-fluxury) library.

## Example

```js
var createStore = require('fluxury').createStore
var createReduxStore = require('redux').createStore
var createReducer = require('fluxury-redux').createReducer

var MessageStore = createStore(
  'Messages Store',
  [], // initial state is empty array
  {
    // type is 'receiveMessage' and data is the message.
    receiveMessage: (state, data) => state.concat(data)
  }
)

var MessageCountStore = createStore(
  'Message Count Store',
  function(state=0, action, waitFor) {
    // ensure that MessageStore reducer is executed first
    waitFor([MessageStore.dispatchToken])
    switch(action.type) {
      case 'loadMessage':
      return state+1
    }
    return state
  }
)

var store = createReduxStore( createReducer(MessageStore, MessageCountStore) )
```

## Create Store

Combine multiple stores into a single store. Interface compatible with Redux.

```js
import { createStore } from 'fluxury-redux'
import MessageStore from './MessageStore'
import MessageCountStore from './MessageCountStore'

var store = createStore({
  messages: MessageStore,
  count: MessageCountStore
})
```
