'use strict'

const test = require('tape')
const { mockStore, mockEvent, mockListeners } = require('../mocks/pipelines')

test('UNIT => listeners => onKeypress => letter => sends search to background', t => {
  t.plan(17)
  try {
    const state = {
      visibility: 'visible',
      searchterm: 'searchterm',
      suggestions: 'suggestions'
    }
    const {
      listeners,
      getWindowSelection,
      getCurrentCursorPos,
      getWindowScroll,
      getCursorOffset,
      getCurrentText,
      findSearchterm,
      dispatchPosition,
      dispatchSearchterm,
      sendSearchtermToBackground
    } = mockListeners()
    const store = mockStore(state)
    const app = 'app'
    const e = mockEvent({key: 'w'})
    const id = 'foo'
    const { onKeypress } = listeners(store, app, id)
    onKeypress(e)
    t.ok(getWindowSelection.calledWith({}), 'window selection queried')
    t.ok(getCurrentCursorPos.calledWith(e.target, {}), 'current cursor pos queried')
    t.ok(getWindowScroll.calledWith(e.target, {}), 'window scroll queried')
    t.ok(getCursorOffset.calledWith(e, {}), 'cursor offset queried')
    t.ok(getCurrentText.calledWith(e.target, {}), 'current text queried')
    t.ok(findSearchterm.calledWith(e.key, {}), 'searchterm found')
    t.ok(dispatchPosition.calledWith(app, {}), 'positioned dispatched')
    t.ok(dispatchSearchterm.calledWith(app, {}), 'searchterm dispatched')
    t.ok(sendSearchtermToBackground.calledWith(id, {}), 'searchterm send to background')
    t.ok(
      getCurrentCursorPos.calledAfter(getWindowSelection),
      'selection placed in ctx before querying cursor position'
    )
    t.ok(
      getCursorOffset.calledAfter(getWindowScroll),
      'window scroll placed in ctx before querying cursor offset'
    )
    t.ok(
      getCurrentText.calledAfter(getWindowSelection),
      'selection placed in ctx before querying current text'
    )
    t.ok(
      findSearchterm.calledAfter(getCurrentCursorPos),
      'initCurPos placed in ctx before finding searchterm'
    )
    t.ok(
      findSearchterm.calledAfter(getCurrentText),
      'initText placed in ctx before finding searchterm'
    )
    t.ok(
      dispatchPosition.calledAfter(getCursorOffset),
      'position (cusror offset) dispatched only after offset placed in ctx'
    )
    t.ok(
      dispatchSearchterm.calledAfter(findSearchterm),
      'searchterm dispatched only after it was placed in ctx'
    )
    t.ok(
      sendSearchtermToBackground.calledAfter(findSearchterm),
      'searchterm dispatched to background only after it was placed in ctx'
    )
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('UNIT => listeners => onKeypress => number => sends search to background', t => {
  t.plan(17)
  try {
    const state = {
      visibility: 'visible',
      searchterm: 'searchterm',
      suggestions: 'suggestions'
    }
    const {
      listeners,
      getWindowSelection,
      getCurrentCursorPos,
      getWindowScroll,
      getCursorOffset,
      getCurrentText,
      findSearchterm,
      dispatchPosition,
      dispatchSearchterm,
      sendSearchtermToBackground
    } = mockListeners()
    const store = mockStore(state)
    const app = 'app'
    const e = mockEvent({key: 4})
    const id = 'foo'
    const { onKeypress } = listeners(store, app, id)
    onKeypress(e)
    t.ok(getWindowSelection.calledWith({}), 'window selection queried')
    t.ok(getCurrentCursorPos.calledWith(e.target, {}), 'current cursor pos queried')
    t.ok(getWindowScroll.calledWith(e.target, {}), 'window scroll queried')
    t.ok(getCursorOffset.calledWith(e, {}), 'cursor offset queried')
    t.ok(getCurrentText.calledWith(e.target, {}), 'current text queried')
    t.ok(findSearchterm.calledWith(e.key, {}), 'searchterm found')
    t.ok(dispatchPosition.calledWith(app, {}), 'positioned dispatched')
    t.ok(dispatchSearchterm.calledWith(app, {}), 'searchterm dispatched')
    t.ok(sendSearchtermToBackground.calledWith(id, {}), 'searchterm send to background')
    t.ok(
      getCurrentCursorPos.calledAfter(getWindowSelection),
      'selection placed in ctx before querying cursor position'
    )
    t.ok(
      getCursorOffset.calledAfter(getWindowScroll),
      'window scroll placed in ctx before querying cursor offset'
    )
    t.ok(
      getCurrentText.calledAfter(getWindowSelection),
      'selection placed in ctx before querying current text'
    )
    t.ok(
      findSearchterm.calledAfter(getCurrentCursorPos),
      'initCurPos placed in ctx before finding searchterm'
    )
    t.ok(
      findSearchterm.calledAfter(getCurrentText),
      'initText placed in ctx before finding searchterm'
    )
    t.ok(
      dispatchPosition.calledAfter(getCursorOffset),
      'position (cusror offset) dispatched only after offset placed in ctx'
    )
    t.ok(
      dispatchSearchterm.calledAfter(findSearchterm),
      'searchterm dispatched only after it was placed in ctx'
    )
    t.ok(
      sendSearchtermToBackground.calledAfter(findSearchterm),
      'searchterm dispatched to background only after it was placed in ctx'
    )
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('UNIT => listeners => onKeypress => letter => noop when altKey', t => {
  t.plan(9)
  try {
    const state = {
      visibility: 'visible',
      searchterm: 'searchterm',
      suggestions: 'suggestions'
    }
    const {
      listeners,
      getWindowSelection,
      getCurrentCursorPos,
      getWindowScroll,
      getCursorOffset,
      getCurrentText,
      findSearchterm,
      dispatchPosition,
      dispatchSearchterm,
      sendSearchtermToBackground
    } = mockListeners()
    const store = mockStore(state)
    const app = 'app'
    const e = mockEvent({key: 'w', altKey: true})
    const id = 'foo'
    const { onKeypress } = listeners(store, app, id)
    onKeypress(e)
    t.ok(getWindowSelection.notCalled, 'window selection not queried')
    t.ok(getCurrentCursorPos.notCalled, 'current cursor pos not queried')
    t.ok(getWindowScroll.notCalled, 'window scroll not queried')
    t.ok(getCursorOffset.notCalled, 'cursor offset not queried')
    t.ok(getCurrentText.notCalled, 'current text not queried')
    t.ok(findSearchterm.notCalled, 'searchterm not found')
    t.ok(dispatchPosition.notCalled, 'positioned not dispatched')
    t.ok(dispatchSearchterm.notCalled, 'searchterm not dispatched')
    t.ok(sendSearchtermToBackground.notCalled, 'searchterm not send to background')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('UNIT => listeners => onKeypress => letter => noop when ctrlKey', t => {
  t.plan(9)
  try {
    const state = {
      visibility: 'visible',
      searchterm: 'searchterm',
      suggestions: 'suggestions'
    }
    const {
      listeners,
      getWindowSelection,
      getCurrentCursorPos,
      getWindowScroll,
      getCursorOffset,
      getCurrentText,
      findSearchterm,
      dispatchPosition,
      dispatchSearchterm,
      sendSearchtermToBackground
    } = mockListeners()
    const store = mockStore(state)
    const app = 'app'
    const e = mockEvent({key: 'w', ctrlKey: true})
    const id = 'foo'
    const { onKeypress } = listeners(store, app, id)
    onKeypress(e)
    t.ok(getWindowSelection.notCalled, 'window selection not queried')
    t.ok(getCurrentCursorPos.notCalled, 'current cursor pos not queried')
    t.ok(getWindowScroll.notCalled, 'window scroll not queried')
    t.ok(getCursorOffset.notCalled, 'cursor offset not queried')
    t.ok(getCurrentText.notCalled, 'current text not queried')
    t.ok(findSearchterm.notCalled, 'searchterm not found')
    t.ok(dispatchPosition.notCalled, 'positioned not dispatched')
    t.ok(dispatchSearchterm.notCalled, 'searchterm not dispatched')
    t.ok(sendSearchtermToBackground.notCalled, 'searchterm not send to background')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('UNIT => listeners => onKeypress => letter => noop when metaKey', t => {
  t.plan(9)
  try {
    const state = {
      visibility: 'visible',
      searchterm: 'searchterm',
      suggestions: 'suggestions'
    }
    const {
      listeners,
      getWindowSelection,
      getCurrentCursorPos,
      getWindowScroll,
      getCursorOffset,
      getCurrentText,
      findSearchterm,
      dispatchPosition,
      dispatchSearchterm,
      sendSearchtermToBackground
    } = mockListeners()
    const store = mockStore(state)
    const app = 'app'
    const e = mockEvent({key: 'w', metaKey: true})
    const id = 'foo'
    const { onKeypress } = listeners(store, app, id)
    onKeypress(e)
    t.ok(getWindowSelection.notCalled, 'window selection not queried')
    t.ok(getCurrentCursorPos.notCalled, 'current cursor pos not queried')
    t.ok(getWindowScroll.notCalled, 'window scroll not queried')
    t.ok(getCursorOffset.notCalled, 'cursor offset not queried')
    t.ok(getCurrentText.notCalled, 'current text not queried')
    t.ok(findSearchterm.notCalled, 'searchterm not found')
    t.ok(dispatchPosition.notCalled, 'positioned not dispatched')
    t.ok(dispatchSearchterm.notCalled, 'searchterm not dispatched')
    t.ok(sendSearchtermToBackground.notCalled, 'searchterm not send to background')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('UNIT => listeners => onKeypress => space => hides box and sends word to background', t => {
  t.plan(11)
  try {
    const state = {
      visibility: 'visible',
      searchterm: 'searchterm',
      suggestions: 'suggestions'
    }
    const {
      listeners,
      getWindowSelection,
      getCurrentCursorPos,
      getCurrentText,
      findSearchterm,
      sendNewWordToBackground,
      dispatchAction
    } = mockListeners()
    const store = mockStore(state)
    const app = 'app'
    const e = mockEvent({key: ' '})
    const id = 'foo'
    const { onKeypress } = listeners(store, app, id)
    onKeypress(e)
    t.ok(getWindowSelection.calledWith({}), 'window selection queried')
    t.ok(getCurrentCursorPos.calledWith(e.target, {}), 'current cursor pos queried')
    t.ok(getCurrentText.calledWith(e.target, {}), 'current text queried')
    t.ok(findSearchterm.calledWith('', {}), 'last word found')
    t.ok(sendNewWordToBackground.calledWith(id, {}), 'new word sent to background')
    t.ok(dispatchAction.calledWith(app, 'visibility', 'hidden', {}), 'box hidden')
    t.ok(
      getCurrentCursorPos.calledAfter(getWindowSelection),
      'selection placed in ctx before querying cursor position'
    )
    t.ok(
      getCurrentText.calledAfter(getWindowSelection),
      'selection placed in ctx before querying current text'
    )
    t.ok(
      findSearchterm.calledAfter(getCurrentCursorPos),
      'initCurPos placed in ctx before finding searchterm'
    )
    t.ok(
      findSearchterm.calledAfter(getCurrentText),
      'initText placed in ctx before finding searchterm'
    )
    t.ok(
      sendNewWordToBackground.calledAfter(findSearchterm),
      'new word only sent to background after it was placed in ctx'
    )
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('UNIT => listeners => onKeypress => space => noop if altKey', t => {
  t.plan(6)
  try {
    const state = {
      visibility: 'visible',
      searchterm: 'searchterm',
      suggestions: 'suggestions'
    }
    const {
      listeners,
      getWindowSelection,
      getCurrentCursorPos,
      getCurrentText,
      findSearchterm,
      sendNewWordToBackground,
      dispatchAction
    } = mockListeners()
    const store = mockStore(state)
    const app = 'app'
    const e = mockEvent({key: ' ', altKey: true})
    const id = 'foo'
    const { onKeypress } = listeners(store, app, id)
    onKeypress(e)
    t.ok(getWindowSelection.notCalled, 'window selection not queried')
    t.ok(getCurrentCursorPos.notCalled, 'current cursor pos not queried')
    t.ok(getCurrentText.notCalled, 'current text not queried')
    t.ok(findSearchterm.notCalled, 'last word not found')
    t.ok(sendNewWordToBackground.notCalled, 'new word not sent to background')
    t.ok(dispatchAction.notCalled, 'box not hidden')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})
