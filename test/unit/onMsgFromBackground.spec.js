'use strict'

const test = require('tape')
const { mockStore, mockEvent, getStubbedListeners } = require('../mocks/pipelines')

test('UNIT => listeners => onMsgFromBackground => updates suggestions and shows box', t => {
  t.plan(2)
  try {
    const {
      listeners,
      dispatchAction,
    } = getStubbedListeners()
    const store = mockStore({})
    const app = 'app'
    const e = mockEvent({key: 'w'})
    const id = 'foo'
    const appId = id
    const suggestions = 'suggestions'
    const { onMsgFromBackground } = listeners(store, app, id)
    onMsgFromBackground({appId, suggestions})
    t.ok(dispatchAction.calledWith(app, 'visibility', 'visible', {}), 'box shown')
    t.ok(dispatchAction.calledWith(app, 'suggest', suggestions, {}), 'suggestions updated')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('UNIT => listeners => onMsgFromBackground => noop when not my id', t => {
  t.plan(1)
  try {
    const {
      listeners,
      dispatchAction,
    } = getStubbedListeners()
    const store = mockStore({})
    const app = 'app'
    const e = mockEvent({key: 'w'})
    const id = 'foo'
    const appId = 'not foo'
    const suggestions = 'suggestions'
    const { onMsgFromBackground } = listeners(store, app, id)
    onMsgFromBackground({appId, suggestions})
    t.ok(dispatchAction.notCalled, 'no actions dispatched to ui')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})
