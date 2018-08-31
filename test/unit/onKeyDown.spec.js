'use strict'

const test = require('tape')
const { mockStore, mockEvent, getStubbedListeners } = require('../mocks/pipelines')

test('UNIT => listeners => onKeyDown => Tab => completes word', t => {
  t.plan(7)
  try {
    const state = {
      visibility: 'visible',
      searchterm: 'searchterm',
      suggestion: 'suggestion'
    }
    const {
      listeners,
      updateTextNode,
      focusEventTarget,
      dispatchAction,
      sendAcceptedToBackground,
      findTextToInsert
    } = getStubbedListeners()
    const store = mockStore(state)
    const app = 'app'
    const e = mockEvent({key: 'Tab'})
    const id = 'foo'
    const { onKeyDown } = listeners(store, app, id)
    onKeyDown(e)
    t.ok(
      findTextToInsert.calledWith(
        {searchterm: state.searchterm, suggestion: state.suggestion}
      ),
      'text formatted properly'
    )
    t.ok(
      updateTextNode.calledWith(
        e.target,
        {searchterm: state.searchterm, suggestion: state.suggestion}
      ),
      'text node updated properly'
    )
    t.ok(
      focusEventTarget.calledWith(
        e,
        {searchterm: state.searchterm, suggestion: state.suggestion}
      ),
      'event target focused'
    )
    t.ok(
      dispatchAction.calledWith(
        app,
        'visibility',
        'hidden',
        {searchterm: state.searchterm, suggestion: state.suggestion}
      ),
      'box hidden'
    )
    t.ok(
      sendAcceptedToBackground.calledWith(
        id,
        {searchterm: state.searchterm, suggestion: state.suggestion}
      ),
      'nothing sent to background'
    )
    t.ok(updateTextNode.calledBefore(focusEventTarget), 'target focused after text node was updated')
    t.ok(findTextToInsert.calledBefore(updateTextNode), 'text formatted before text node was updated')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('UNIT => listeners => onKeyDown => Tab => noop when store is not visible', t => {
  t.plan(5)
  try {
    const state = {
      visibility: 'hidden',
      searchterm: 'searchterm',
      suggestion: 'suggestion'
    }
    const {
      listeners,
      updateTextNode,
      focusEventTarget,
      dispatchAction,
      sendAcceptedToBackground,
      findTextToInsert
    } = getStubbedListeners()
    const store = mockStore(state)
    const app = 'app'
    const e = mockEvent({key: 'Tab'})
    const id = 'foo'
    const { onKeyDown } = listeners(store, app, id)
    onKeyDown(e)
    t.ok(findTextToInsert.notCalled, 'text formatter not called')
    t.ok(updateTextNode.notCalled, 'text node not updated')
    t.ok(focusEventTarget.notCalled, 'event target not focused')
    t.ok(dispatchAction.notCalled, 'box not hidden')
    t.ok(sendAcceptedToBackground.notCalled, 'accepted not sent to background')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('UNIT => listeners => onKeyDown => Escape => hides box', t => {
  t.plan(1)
  try {
    const state = {
      visibility: 'visible'
    }
    const {
      listeners,
      dispatchAction
    } = getStubbedListeners()
    const store = mockStore(state)
    const app = 'app'
    const e = mockEvent({key: 'Escape'})
    const id = 'foo'
    const { onKeyDown } = listeners(store, app, id)
    onKeyDown(e)
    t.ok(dispatchAction.calledWith(app, 'visibility', 'hidden'), 'box hidden')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})
