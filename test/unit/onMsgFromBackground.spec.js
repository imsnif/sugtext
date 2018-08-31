'use strict'

const test = require('tape')
const { mockStore, getStubbedListeners } = require('../mocks/pipelines')

test('UNIT => listeners => onMsgFromBackground => updates suggestion and shows box', t => {
  t.plan(3)
  try {
    const {
      listeners,
      dispatchAction,
      dispatchSearchterm
    } = getStubbedListeners()
    const store = mockStore({})
    const app = 'app'
    const id = 'foo'
    const appId = id
    const suggestion = 'suggestion'
    const searchterm = 'searchterm'
    const { onMsgFromBackground } = listeners(store, app, id)
    onMsgFromBackground({appId, suggestion, searchterm})
    t.ok(dispatchAction.calledWith(app, 'visibility', 'visible', {}), 'box shown')
    t.ok(dispatchAction.calledWith(app, 'suggest', suggestion, {}), 'suggestion updated')
    t.ok(dispatchSearchterm.calledWith(app, searchterm, {}), 'searchterm updated')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test(
  'UNIT => listeners => onMsgFromBackground => suggestion hidden when not my id',
  t => {
    t.plan(1)
    try {
      const {
        listeners,
        dispatchAction
      } = getStubbedListeners()
      const store = mockStore({})
      const app = 'app'
      const id = 'foo'
      const appId = 'not foo'
      const suggestion = 'suggestion'
      const { onMsgFromBackground } = listeners(store, app, id)
      onMsgFromBackground({appId, suggestion})
      t.ok(
        dispatchAction.calledWith(app, 'visibility', 'hidden'),
        'box hidden'
      )
    } catch (e) {
      t.fail(e)
      t.end()
    }
  }
)
