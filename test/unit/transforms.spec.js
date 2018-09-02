const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

const { Identity } = require('monet')
const Future = require('fluture')

function getStubbedTransform (stubs) {
  return proxyquire('../../js/pipeline/transforms', {
    './io': stubs,
    './arrange-data': stubs
  })
}

test('UNIT => getStoreKeyValue(store, key, ctx) => ' +
  'reads value from store into ctx',
t => {
  t.plan(1)
  try {
    const store = 'store'
    const key = 'key'
    const ctx = {a: 1}
    const getFromStoreIO = sinon.stub()
      .withArgs(store, key)
      .returns(Identity('foo'))
    const { getStoreKeyValue } = getStubbedTransform({getFromStoreIO})
    getStoreKeyValue(store)(key)(ctx).map(newCtx => t.deepEquals(
      newCtx,
      Object.assign({}, ctx, {[key]: 'foo'}),
      'return value merged to ctx'
    ))
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => getWindowSelection(ctx) => ' +
  'reads window selection into ctx',
t => {
  t.plan(1)
  try {
    const ctx = {a: 1}
    const getWindowSelectionIO = sinon.stub()
      .returns(Identity('foo'))
    const { getWindowSelection } = getStubbedTransform({getWindowSelectionIO})
    getWindowSelection(ctx).map(newCtx => t.deepEquals(
      newCtx,
      Object.assign({}, ctx, {selection: 'foo'}),
      'selection merged to ctx'
    ))
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => getWindowScroll(el, ctx) => ' +
  'reads window scroll into ctx',
t => {
  t.plan(1)
  try {
    const ctx = {a: 1}
    const el = {foo: 'bar'}
    const getWindowScrollIO = sinon.stub()
      .withArgs(el)
      .returns(Identity('foo'))
    const { getWindowScroll } = getStubbedTransform({getWindowScrollIO})
    getWindowScroll(el)(ctx).map(newCtx => t.deepEquals(
      newCtx,
      Object.assign({}, ctx, {pageScroll: 'foo'}),
      'page scroll merged to ctx'
    ))
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => getCurrentCursorPos(el, ctx) => ' +
  'returns cursor position for textarea el',
t => {
  t.plan(1)
  try {
    const ctx = {selection: 'foobar'}
    const el = {type: 'textarea'}
    const getSelectedTextareaCurPosIO = sinon.stub()
      .withArgs(el)
      .returns(Identity('foo'))
    const { getCurrentCursorPos } = getStubbedTransform({
      getSelectedTextareaCurPosIO
    })
    getCurrentCursorPos(el)(ctx).map(newCtx => t.deepEquals(
      newCtx,
      Object.assign({}, ctx, {initCurPos: 'foo'}),
      'selected cursor pos merged to ctx'
    ))
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => getCurrentCursorPos(el, ctx) => ' +
  'returns cursor position for contentEditable el',
t => {
  t.plan(1)
  try {
    const ctx = {selection: 'foobar'}
    const el = {type: 'contentEditable'}
    const getPosFromSelection = sinon.stub()
      .withArgs(ctx.selection)
      .returns(Identity('foo'))
    const { getCurrentCursorPos } = getStubbedTransform({
      getPosFromSelection
    })
    getCurrentCursorPos(el)(ctx).map(newCtx => t.deepEquals(
      newCtx,
      Object.assign({}, ctx, {initCurPos: 'foo'}),
      'selected cursor pos merged to ctx'
    ))
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => getCurrentText(el, ctx) => ' +
  'returns element text for textarea el',
t => {
  t.plan(1)
  try {
    const ctx = {selection: 'foobar'}
    const el = {type: 'textarea'}
    const getCurrentTextareaTextIO = sinon.stub()
      .withArgs(el)
      .returns(Identity('foo'))
    const { getCurrentText } = getStubbedTransform({
      getCurrentTextareaTextIO
    })
    getCurrentText(el)(ctx).map(newCtx => t.deepEquals(
      newCtx,
      Object.assign({}, ctx, {initText: 'foo'}),
      'element text merged to ctx'
    ))
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => getCurrentText(el, ctx) => ' +
  'returns element text for contentEditable el',
t => {
  t.plan(1)
  try {
    const ctx = {selection: 'foobar'}
    const el = {type: 'contentEditable'}
    const getTextFromSelection = sinon.stub()
      .withArgs(el)
      .returns(Identity('foo'))
    const { getCurrentText } = getStubbedTransform({
      getTextFromSelection
    })
    getCurrentText(el)(ctx).map(newCtx => t.deepEquals(
      newCtx,
      Object.assign({}, ctx, {initText: 'foo'}),
      'element text merged to ctx'
    ))
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => getClientSize(ctx) => ' +
  'reads clientSize into ctx',
t => {
  t.plan(1)
  try {
    const ctx = {selection: 'foobar'}
    const getClientSizeIO = sinon.stub()
      .returns(Identity('foo'))
    const { getClientSize } = getStubbedTransform({
      getClientSizeIO
    })
    getClientSize(ctx).map(newCtx => t.deepEquals(
      newCtx,
      Object.assign({}, ctx, {clientSize: 'foo'}),
      'client size merged to ctx'
    ))
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => getAppSize(ctx) => ' +
  'reads appSize into ctx',
t => {
  t.plan(1)
  try {
    const ctx = {selection: 'foobar'}
    const app = 'app'
    const getAppSizeIO = sinon.stub()
      .withArgs(app)
      .returns(Identity('foo'))
    const { getAppSize } = getStubbedTransform({
      getAppSizeIO
    })
    getAppSize(app)(ctx).map(newCtx => t.deepEquals(
      newCtx,
      Object.assign({}, ctx, {appSize: 'foo'}),
      'client size merged to ctx'
    ))
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => getCursorOffset(e, ctx) => ' +
  'reads cursor offset into ctx',
t => {
  t.plan(1)
  try {
    const ctx = {pageScroll: 'foobar'}
    const e = {target: 'baz'}
    const getCursorOffsetIO = sinon.stub()
      .withArgs(e.target, ctx.pageScroll)
      .returns(Identity('foo'))
    const { getCursorOffset } = getStubbedTransform({
      getCursorOffsetIO
    })
    getCursorOffset(e)(ctx).map(newCtx => t.deepEquals(
      newCtx,
      Object.assign({}, ctx, {offset: 'foo'}),
      'offset merged to ctx'
    ))
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => getMaxZIndex(ctx) => ' +
  'reads maxZIndex into ctx',
t => {
  t.plan(1)
  try {
    const ctx = {foo: 'bar'}
    const getMaxZIndexIO = sinon.stub()
      .returns(Identity('foo'))
    const { getMaxZIndex } = getStubbedTransform({getMaxZIndexIO})
    getMaxZIndex(ctx).map(newCtx => t.deepEquals(
      newCtx,
      Object.assign({}, ctx, {maxZIndex: 'foo'}),
      'maxZIndex merged to ctx'
    ))
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => updateTextNode(el, ctx) => ' +
  'updates text node and returns ctx',
t => {
  t.plan(1)
  try {
    const ctx = {textToInsert: 'foobar'}
    const el = {foo: 'bar'}
    const updateTextNodeIO = sinon.stub()
      .withArgs(el, ctx.textToInsert)
      .returns(Identity('foo'))
    const { updateTextNode } = getStubbedTransform({
      updateTextNodeIO
    })
    updateTextNode(el)(ctx).map(newCtx => t.deepEquals(
      ctx,
      newCtx,
      'ctx returned'
    ))
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => focusEventTarget(e, ctx) => ' +
  'focuses event target and returns ctx',
t => {
  t.plan(1)
  try {
    const ctx = {a: 1}
    const e = 'e'
    const focusEventTargetIO = sinon.stub()
      .withArgs(e)
      .returns(Identity('foo'))
    const { focusEventTarget } = getStubbedTransform({
      focusEventTargetIO
    })
    focusEventTarget(e)(ctx).map(newCtx => t.deepEquals(
      ctx,
      newCtx,
      'ctx returned'
    ))
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => dispatchAction(app, type, val, ctx) => ' +
  'dispatches action and returns ctx',
t => {
  t.plan(1)
  try {
    const ctx = {a: 1}
    const app = 'app'
    const type = 'type'
    const val = 'val'
    const dispatchActionIO = sinon.stub()
      .withArgs(app, type, val, ctx)
      .returns(Identity('foo'))
    const { dispatchAction } = getStubbedTransform({
      dispatchActionIO
    })
    dispatchAction(app)(type)(val)(ctx).map(newCtx => t.deepEquals(
      ctx,
      newCtx,
      'ctx returned'
    ))
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => updateState(app, store, type, val, ctx) => ' +
  'updates state and returns ctx',
t => {
  t.plan(1)
  try {
    const ctx = {a: 1}
    const app = 'app'
    const store = 'store'
    const type = 'type'
    const val = 'val'
    const updateStateIO = sinon.stub()
      .withArgs(app, store, type, val, ctx)
      .returns(Identity('foo'))
    const { updateState } = getStubbedTransform({
      updateStateIO
    })
    updateState(app)(store)(type)(val)(ctx).map(newCtx => t.deepEquals(
      ctx,
      newCtx,
      'ctx returned'
    ))
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => updateStateFromCtx(app, store, ctxKey, key, ctx) => ' +
  'updates state and returns ctx',
t => {
  t.plan(1)
  try {
    const ctxKey = 'ctxKey'
    const ctx = {[ctxKey]: 'val'}
    const app = 'app'
    const store = 'store'
    const key = 'key'
    const updateStateIO = sinon.stub()
      .withArgs(app, store, key, ctx[ctxKey], ctx)
      .returns(Identity('foo'))
    const { updateStateFromCtx } = getStubbedTransform({
      updateStateIO
    })
    updateStateFromCtx(app)(store)(ctxKey)(key)(ctx).map(newCtx => t.deepEquals(
      ctx,
      newCtx,
      'ctx returned'
    ))
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => updateStateFromCtx(app, store, ctxKey, key, ctx) => ' +
  'updates state and returns ctx (failure - no key)',
t => {
  t.plan(1)
  try {
    const ctxKey = 'ctxKey'
    const ctx = {}
    const app = 'app'
    const store = 'store'
    const key = 'key'
    const updateStateIO = sinon.stub()
      .withArgs(app, store, key, ctx[ctxKey], ctx)
      .returns(Identity('foo'))
    const { updateStateFromCtx } = getStubbedTransform({
      updateStateIO
    })
    updateStateFromCtx(app)(store)(ctxKey)(key)(ctx).cata(
      e => t.equals(
        e.message,
        `no such value ${ctxKey} in ctx`,
        'proper error message'
      )
    )
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => dispatchSearchterm(app, ctx) => ' +
  'dispatches search action and returns ctx',
t => {
  t.plan(1)
  try {
    const searchterm = 'searchterm'
    const ctx = {foo: 'bar'}
    const app = 'app'
    const dispatchActionIO = sinon.stub()
      .withArgs(app, 'search', searchterm)
      .returns(Identity('foo'))
    const { dispatchSearchterm } = getStubbedTransform({
      dispatchActionIO
    })
    dispatchSearchterm(app)(searchterm)(ctx).map(newCtx => t.equals(
      ctx,
      newCtx,
      'ctx returned'
    ))
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => dispatchPosition(app, ctx) => ' +
  'dispatches position action and returns ctx',
t => {
  t.plan(1)
  try {
    const ctx = {position: 'foobar'}
    const app = 'app'
    const dispatchActionIO = sinon.stub()
      .withArgs(app, 'position', ctx.position)
      .returns(Identity('foo'))
    const { dispatchPosition } = getStubbedTransform({
      dispatchActionIO
    })
    dispatchPosition(app)(ctx).map(newCtx => t.equals(
      ctx,
      newCtx,
      'ctx returned'
    ))
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => sendSearchtermToBackground(appId, ctx) => ' +
  'sends search term to background and returns ctx',
t => {
  t.plan(1)
  try {
    const searchterm = 'foobar'
    const ctx = {searchterm}
    const appId = 42
    const sendToBackgroundIO = sinon.stub()
      .withArgs({appId, searchterm})
      .returns(Identity('foo'))
    const { sendSearchtermToBackground } = getStubbedTransform({
      sendToBackgroundIO
    })
    sendSearchtermToBackground(appId)(ctx).map(newCtx => t.equals(
      ctx,
      newCtx,
      'ctx returned'
    ))
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => sendAcceptedToBackground(appId, ctx) => ' +
  'sends accepted term to background and returns ctx',
t => {
  t.plan(1)
  try {
    const searchterm = 'foobar'
    const textToInsert = 'ilicious'
    const ctx = {searchterm, textToInsert}
    const appId = 42
    const sendToBackgroundIO = sinon.stub()
      .withArgs({appId, newWord: searchterm + textToInsert})
      .returns(Identity('foo'))
    const { sendAcceptedToBackground } = getStubbedTransform({
      sendToBackgroundIO
    })
    sendAcceptedToBackground(appId)(ctx).map(newCtx => t.equals(
      ctx,
      newCtx,
      'ctx returned'
    ))
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => sendNewWordToBackground(appId, ctx) => ' +
  'sends new word to background and returns ctx',
t => {
  t.plan(1)
  try {
    const searchterm = 'foobar'
    const ctx = {searchterm}
    const appId = 42
    const sendToBackgroundIO = sinon.stub()
      .withArgs({appId, newWord: searchterm})
      .returns(Identity('foo'))
    const { sendNewWordToBackground } = getStubbedTransform({
      sendToBackgroundIO
    })
    sendNewWordToBackground(appId)(ctx).map(newCtx => t.equals(
      ctx,
      newCtx,
      'ctx returned'
    ))
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => maybePropToCtx(prop, obj, ctx) => ' +
  'merges prop to ctx if exists',
t => {
  t.plan(1)
  try {
    const prop = 'foo'
    const obj = {foo: 'bar', bar: 'baz'}
    const ctx = {a: 1}
    const { maybePropToCtx } = getStubbedTransform({})
    maybePropToCtx(prop)(obj)(ctx).map(newCtx => {
      t.deepEquals(
        newCtx,
        Object.assign({}, ctx, {foo: 'bar'}),
        'merged ctx returned'
      )
      return ctx
    })
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => maybePropToCtx(prop, obj, ctx) => ' +
  'rejects if prop does not exist in ctx',
t => {
  t.plan(1)
  try {
    const prop = 'I do not exist'
    const obj = {foo: 'bar', bar: 'baz'}
    const ctx = {a: 1}
    const { maybePropToCtx } = getStubbedTransform({})
    maybePropToCtx(prop)(obj)(ctx).fork(e => t.pass('rejected'), t.fail)
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => readParallelToCtx(parallelTasks, ctx) => ' +
  'runs tasks in parallel and merges them to ctx',
t => {
  t.plan(1)
  try {
    const ctx = {a: 1}
    const parallelTasks = [
      ctx => Future.tryP(() => {
        return new Promise(
          resolve => process.nextTick(() => resolve({b: ctx.a + 1}))
        )
      }),
      ctx => Future.tryP(() => {
        return new Promise(
          resolve => process.nextTick(() => resolve({c: ctx.a + 2}))
        )
      })
    ]
    const { readParallelToCtx } = getStubbedTransform({})
    readParallelToCtx(parallelTasks)(ctx).fork(
      e => t.fail('rejected'),
      ctx => t.deepEquals(
        ctx,
        Object.assign({}, ctx, {b: 2, c: 3}),
        'tasks merged into ctx'
      )
    )
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})
