'use strict'

const test = require('tape')
const sinon = require('sinon')
const { mockStore, mockListeners } = require('../mocks/pipelines')

test('UNIT => listeners => onBlur => hides box onNextTick', async t => {
  t.plan(2)
  sinon.spy(process, 'nextTick')
  try {
    const {
      listeners,
      dispatchAction
    } = mockListeners()
    const store = mockStore({})
    const app = 'app'
    const id = 'foo'
    const { onBlur } = listeners(store, app, id)
    onBlur()
    await new Promise(resolve => setImmediate(resolve))
    t.ok(process.nextTick.calledBefore(dispatchAction), 'action dispatched after current eventloop tick')
    t.ok(
      dispatchAction.calledWith(
        app,
        'visibility',
        'hidden',
        {}
      ),
      'box hidden'
    )
    process.nextTick.restore()
  } catch (e) {
    t.fail(e)
    process.nextTick.restore()
    t.end()
  }
})
