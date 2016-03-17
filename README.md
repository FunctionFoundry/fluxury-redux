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

## With Redux

```js
var createReduxStore = require('redux').createStore
var createReducer = require('fluxury-redux').createReducer
var MessageStore = require('./MessageStore')
var MessageCountStore = requrie('./MessageCountStore')

// will reduce to array with an item for each store
var store = createReduxStore( createReducer(MessageStore, MessageCountStore) )
```

## Without Redux

Combine multiple stores into a single store. Interface compatible with Redux.

```js
import { createStore } from 'fluxury-redux'
import MessageStore from './MessageStore'
import MessageCountStore from './MessageCountStore'

// will reduce to an object where the stores for messages and count are
// composed into a larger object with the same shape. Only supports 1 level.
var store = createStore({
  messages: MessageStore,
  count: MessageCountStore
})
```
