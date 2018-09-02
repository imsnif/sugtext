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
  t.plan(14)
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

test('UNIT => api => suggest => updates app state with suggestion', t => {
  t.plan(1)
  try {
    const state = {}
    const suggestion = 'foo'
    const app = 'bar'
    const store = mockStore(state)
    const {
      suggest,
      updateState
    } = stubApi({app, store})
    suggest(suggestion)
    t.ok(
      updateState.calledWith(store, app, 'suggestion', suggestion, {}),
      'state updated with suggestion'
    )
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('UNIT => api => observe => DOM element observed properly', t => {
  t.plan(8)
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
      onKeyDown,
      getMaxZIndex,
      updateStateFromCtx
    } = stubApi({app, store, el})
    t.ok(
      observe.calledWith(observationSelector),
      'DOM queried for desired elements'
    )
    t.ok(
      getMaxZIndex.calledOnce,
      'maxZIndex on page found'
    )
    t.ok(
      updateStateFromCtx.calledWith(store, app, 'maxZIndex', 'maxZIndex'),
      'maxZIndex inserted into state'
    )
    t.ok(
      updateStateFromCtx.calledAfter(getMaxZIndex),
      'maxZIndex inserted into state only after it was found in page'
    )
    t.ok(
      el.addEventListener.calledWith('blur', onBlur),
      'onBlur action registered properly'
    )
    t.ok(
      el.addEventListener.calledWith('click', onBlur),
      'onBlur action registered onClick'
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
