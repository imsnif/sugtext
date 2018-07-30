'use strict'

const test = require('tape')
const { mockStore, stubApi, mockDomElement } = require('../mocks/pipelines')

test('UNIT => api => search => updates app state with searchterm', t => {
  t.plan(1)
  try {
    const state = {}
    const searchterm = 'foo'
    const app = 'bar'
    const store = mockStore(state)
    const {
      search,
      updateState
    } = stubApi({app, store})
    search(searchterm)
    t.ok(
      updateState.calledWith(store, app, 'searchterm', searchterm),
      'searchterm updated in state'
    )
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('UNIT => api => position => updates app state properly', t => {
  t.plan(15)
  try {
    const state = {}
    const off = 'foo'
    const app = 'bar'
    const store = mockStore(state)
    const {
      position,
      getClientSize,
      getAppSize,
      calcBoxHorizontalInverse,
      calcBoxVerticalInverse,
      calcBoxPos,
      updateStateFromCtx
    } = stubApi({app, store})
    position(off)
    t.ok(
      getClientSize.calledWith({}),
      'getClientSize called with ctx'
    )
    t.ok(
      getAppSize.calledWith(app, {}),
      'getAppSize called with app and ctx'
    )
    t.ok(
      calcBoxHorizontalInverse.calledWith(off, {}),
      'calcBoxHorizontalInverse called with off and ctx'
    )
    t.ok(
      calcBoxPos.calledWith(off, {}),
      'calcBoxPos called with off and ctx'
    )
    t.ok(
      updateStateFromCtx.calledWith(store, app, 'boxPos', 'position', {}),
      'box position updated in state'
    )
    t.ok(
      updateStateFromCtx.calledWith(
        store,
        app,
        'inverseVertical',
        'inverseSelection',
        {}
      ),
      'inverseVertical updated in state'
    )
    t.ok(
      calcBoxHorizontalInverse.calledAfter(getClientSize),
      'horizontal inverse called after client size was placed in ctx'
    )
    t.ok(
      calcBoxHorizontalInverse.calledAfter(getAppSize),
      'horizontal inverse called after app size was placed in ctx'
    )
    t.ok(
      calcBoxVerticalInverse.calledAfter(getClientSize),
      'vertical inverse called after client size was placed in ctx'
    )
    t.ok(
      calcBoxVerticalInverse.calledAfter(getAppSize),
      'vertical inverse called after app size was placed in ctx'
    )
    t.ok(
      calcBoxPos.calledAfter(getClientSize),
      'box position calculated after client size was placed in ctx'
    )
    t.ok(
      calcBoxPos.calledAfter(getAppSize),
      'box position calculated after app size was placed in ctx'
    )
    t.ok(
      calcBoxPos.calledAfter(calcBoxHorizontalInverse),
      'box position calculated after horizontal inverse was placed in ctx'
    )
    t.ok(
      calcBoxPos.calledAfter(calcBoxVerticalInverse),
      'box position calculated after vertical inverse was placed in ctx'
    )
    t.ok(
      updateStateFromCtx.calledAfter(calcBoxPos),
      'state updated after box position was updated'
    )
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => api => visibility => updates app state with visibility', t => {
  t.plan(1)
  try {
    const state = {}
    const val = 'foo'
    const app = 'bar'
    const store = mockStore(state)
    const {
      visibility,
      updateState
    } = stubApi({app, store})
    visibility(val)
    t.ok(
      updateState.calledWith(store, app, 'visibility', val),
      'searchterm updated in state'
    )
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('UNIT => api => suggest => updates app state with formatted suggestions', t => {
  t.plan(5)
  try {
    const state = {}
    const suggestions = 'foo'
    const app = 'bar'
    const store = mockStore(state)
    const {
      suggest,
      getStoreKeyValue,
      formatSuggestions,
      updateStateFromCtx
    } = stubApi({app, store})
    suggest(suggestions)
    t.ok(
      getStoreKeyValue.calledWith(store, 'inverseSelection', {}),
      'inverseSelection taken from store'
    )
    t.ok(
      formatSuggestions.calledWith(suggestions, {inverseSelection: undefined}),
      'suggestions properly formatted'
    )
    t.ok(
      updateStateFromCtx.calledWith(store, app, 'orderedSuggestions', 'suggestions'),
      'searchterm updated in state'
    )
    t.ok(
      updateStateFromCtx.calledAfter(formatSuggestions),
      'state updated after suggestions were formatted'
    )
    t.ok(
      formatSuggestions.calledAfter(getStoreKeyValue),
      'suggestions formatted after inverseSelection was placed in ctx'
    )
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('UNIT => api => moveSelection => updates app state with new selected suggestions', t => {
  t.plan(5)
  try {
    const state = {}
    const direction = 'foo'
    const app = 'bar'
    const store = mockStore(state)
    const {
      moveSelection,
      getStoreKeyValue,
      findNewSelectedSuggestions,
      updateStateFromCtx
    } = stubApi({app, store})
    moveSelection(direction)
    t.ok(
      getStoreKeyValue.calledWith(store, 'suggestions', {}),
      'suggestions taken from store'
    )
    t.ok(
      findNewSelectedSuggestions.calledWith(direction, {suggestions: undefined}),
      'new selected suggestion found'
    )
    t.ok(
      updateStateFromCtx.calledWith(store, app, 'selectedSuggestions', 'suggestions'),
      'selectedSuggestions updated in state'
    )
    t.ok(
      updateStateFromCtx.calledAfter(findNewSelectedSuggestions),
      'state updated after new selected suggestions was found'
    )
    t.ok(
      findNewSelectedSuggestions.calledAfter(getStoreKeyValue),
      'new suggestion found after suggestions were placed in ctx'
    )
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('UNIT => api => observe => DOM element observed properly', t => {
  t.plan(4)
  try {
    const observationSelector = 'div[contenteditable="true"],textarea'
    const state = {}
    const el = mockDomElement()
    const app = 'bar'
    const store = mockStore(state)
    const {
      observe,
      onBlur,
      onKeypress,
      onKeyDown
    } = stubApi({app, store, el})
    t.ok(
      observe.calledWith(observationSelector),
      'DOM queried for desired elements'
    )
    t.ok(
      el.addEventListener.calledWith('blur', onBlur),
      'onBlur action registered properly'
    )
    t.ok(
      el.addEventListener.calledWith('keypress', onKeypress),
      'onKeypress action registered properly'
    )
    t.ok(
      el.addEventListener.calledWith('keydown', onKeyDown),
      'onKeyDown action registered properly'
    )
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('UNIT => api => observeBackground => background observed properly', t => {
  t.plan(1)
  try {
    const state = {}
    const el = mockDomElement()
    const app = 'bar'
    const store = mockStore(state)
    const {
      observeBackground,
      onMsgFromBackground
    } = stubApi({app, store, el})
    t.ok(
      observeBackground.calledWith(onMsgFromBackground),
      'background observed with onMsgFromBackground listener'
    )
  } catch (e) {
    t.fail(e)
    t.end()
  }
})
