const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

function getStubbedIo (stubs) {
  const {
    getSelection, pageXOffset, pageYOffset, scrollLeft, scrollTop,
    clientWidth, clientHeight,
    offset,
    insertTextAtCursor,
    dispatch,
    updateQueue,
    sendToBackground
  } = stubs
  global.window = {
    getSelection,
    pageXOffset,
    pageYOffset
  }
  global.document = {
    body: {
      scrollLeft, scrollTop, clientWidth, clientHeight
    }
  }
  global.browser = {
    runtime: {
      sendMessage: {},
      onMessage: {}
    }
  }
  return proxyquire('../../js/pipeline/io', {
    'caret-pos': {offset},
    'insert-text-at-cursor': insertTextAtCursor || {},
    '../util/dispatch': {dispatch},
    '../util/update-queue': updateQueue || {},
    '../util/msg-bus': {sendToBackground}
  })
}

test('UNIT => getWindowSelectionIO() => resolves to window selection', t => {
  t.plan(1)
  try {
    const getSelection = sinon.stub().returns('foo')
    const { getWindowSelectionIO } = getStubbedIo({getSelection})
    getWindowSelectionIO()
      .cata(
        e => t.fail('io failed'),
        selection => t.equals(selection, 'foo', 'selection properly resolved')
      )
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => getWindowSelectionIO() => rejects on failure', t => {
  t.plan(1)
  try {
    const getSelection = sinon.stub().throws(new Error('foo'))
    const { getWindowSelectionIO } = getStubbedIo({getSelection})
    getWindowSelectionIO()
      .cata(
        e => t.equals(e.message, 'foo', 'error properly rejected'),
        () => t.fail('io resolved on throw')
      )
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => getWindowScrollIO(el) => resolves to pageOffset (textarea)', t => {
  t.plan(1)
  try {
    const pageXOffset = 100
    const scrollLeft = 150
    const pageYOffset = 1
    const scrollTop = 5
    const { getWindowScrollIO } = getStubbedIo({
      pageXOffset, scrollLeft, pageYOffset, scrollTop
    })
    const el = {type: 'textarea'}
    getWindowScrollIO(el)
      .cata(
        e => t.fail('io failed'),
        scroll => t.deepEquals(scroll, {
          x: pageXOffset + scrollLeft,
          y: pageYOffset + scrollTop
        }, 'scroll properly resolved')
      )
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => getWindowScrollIO(el) => resolves to pageOffset (other el)', t => {
  t.plan(1)
  try {
    const pageXOffset = 100
    const scrollLeft = 150
    const pageYOffset = 1
    const scrollTop = 5
    const { getWindowScrollIO } = getStubbedIo({
      pageXOffset, scrollLeft, pageYOffset, scrollTop
    })
    const el = {type: 'foo'}
    getWindowScrollIO(el)
      .cata(
        e => t.fail('io failed'),
        scroll => t.deepEquals(scroll, {
          x: pageXOffset,
          y: pageYOffset
        }, 'scroll properly resolved')
      )
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => getAppSizeIO(app) => resolves to app bounding client rect', t => {
  t.plan(1)
  try {
    const app = {getBoundingClientRect: sinon.stub().returns('foo')}
    const { getAppSizeIO } = getStubbedIo({})
    getAppSizeIO(app)
      .cata(
        e => t.fail('io failed'),
        appSize => t.equals(appSize, 'foo', 'app size properly resolved')
      )
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => getAppSizeIO(app) => rejects on throw', t => {
  t.plan(1)
  try {
    const app = {getBoundingClientRect: sinon.stub().throws(new Error('foo'))}
    const { getAppSizeIO } = getStubbedIo({})
    getAppSizeIO(app)
      .cata(
        e => t.equals(e.message, 'foo', 'rejected properly'),
        () => t.fail('did not reject')
      )
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => getFromStoreIO(store, key) => resolves to val', t => {
  t.plan(1)
  try {
    const key = 'bar'
    const store = {get: sinon.stub().withArgs(key).returns('foo')}
    const { getFromStoreIO } = getStubbedIo({})
    getFromStoreIO(store, key)
      .cata(
        e => t.fail('io failed'),
        appSize => t.equals(appSize, 'foo', 'val properly resolved')
      )
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => getFromStoreIO(store, key) => rejects properly', t => {
  t.plan(1)
  try {
    const key = 'bar'
    const store = {get: sinon.stub().withArgs(key).throws(new Error('foo'))}
    const { getFromStoreIO } = getStubbedIo({})
    getFromStoreIO(store, key)
      .cata(
        e => t.equals(e.message, 'foo', 'properly rejected'),
        () => t.fail('did not reject')
      )
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test(
  'UNIT => getCursorOffsetIO(el, pageScroll) => merges offset (textarea)',
  t => {
    t.plan(1)
    try {
      const el = {
        type: 'textarea',
        scrollTop: 18,
        scrollLeft: 11
      }
      const pageScroll = {
        x: 5,
        y: 91
      }
      const elOffset = {
        a: 1,
        left: 8,
        top: 19
      }
      const offset = sinon.stub().withArgs(el, undefined).returns(elOffset)
      const { getCursorOffsetIO } = getStubbedIo({offset})
      getCursorOffsetIO(el, pageScroll)
        .cata(
          e => t.fail('io failed'),
          offset => t.deepEquals(offset, Object.assign({}, elOffset, {
            left: elOffset.left - pageScroll.x - el.scrollLeft,
            top: elOffset.top - pageScroll.y - el.scrollTop
          }), 'offset properly merged')
        )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => getCursorOffsetIO(el, pageScroll) => merges offset (other)',
  t => {
    t.plan(1)
    try {
      const el = {
        type: 'contentEditable',
        scrollTop: 18,
        scrollLeft: 11
      }
      const pageScroll = {
        x: 5,
        y: 91
      }
      const elOffset = {
        a: 1,
        left: 8,
        top: 19
      }
      const offset = sinon.stub().withArgs(
        el,
        {noShadowCaret: true}
      ).returns(elOffset)
      const { getCursorOffsetIO } = getStubbedIo({offset})
      getCursorOffsetIO(el, pageScroll)
        .cata(
          e => t.fail('io failed'),
          offset => t.deepEquals(offset, Object.assign({}, elOffset, {
            left: elOffset.left - pageScroll.x - el.scrollLeft,
            top: elOffset.top - pageScroll.y - el.scrollTop
          }), 'offset properly merged')
        )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => getSelectedTextareaCurPosIO(el) => ' +
  'returns cursor position in textarea element',
  t => {
    t.plan(1)
    try {
      const el = {selectionStart: 'foo', selectionEnd: 'bar'}
      const { getSelectedTextareaCurPosIO } = getStubbedIo({})
      getSelectedTextareaCurPosIO(el)
        .cata(
          e => t.fail('io failed', e),
          val => t.deepEquals(
            val,
            {start: 'foo', end: 'bar'},
            'cursor position resolved'
          )
        )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => getSelectedTextareaCurPosIO(el) => ' +
  'returns cursor position in textarea element (failure with no start/end)',
  t => {
    t.plan(1)
    try {
      const el = {}
      const { getSelectedTextareaCurPosIO } = getStubbedIo({})
      getSelectedTextareaCurPosIO(el)
        .cata(
          e => t.equals(
            e.message,
            'element has no start and end positions',
            'proper error message'
          ),
          () => t.fail('resolved with no start/end')
        )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => getCurrentTextareaTextIO(el) => ' +
  'returns element value',
  t => {
    t.plan(1)
    try {
      const el = {value: 'foo'}
      const { getCurrentTextareaTextIO } = getStubbedIo({})
      getCurrentTextareaTextIO(el)
        .cata(
          e => t.fail('io failed', e),
          val => t.equals(val, el.value, 'value resolved properly')
        )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => getCurrentTextareaTextIO(el) => ' +
  'rejects when no element',
  t => {
    t.plan(1)
    try {
      const { getCurrentTextareaTextIO } = getStubbedIo({})
      getCurrentTextareaTextIO()
        .cata(
          e => t.equals(
            e.message,
            'no element to get text from',
            'value resolved properly'
          ),
          () => t.fail('io resolved on failure')
        )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => updateTextNodeIO(el, textToInsert) => ' +
  'returns element value',
  t => {
    t.plan(1)
    try {
      const insertTextAtCursor = sinon.spy()
      const el = {value: 'foo'}
      const textToInsert = 'bar'
      const { updateTextNodeIO } = getStubbedIo({insertTextAtCursor})
      updateTextNodeIO(el)(textToInsert)
        .cata(
          e => t.fail('io failed', e),
          () => t.ok(
            insertTextAtCursor.calledWith(el, textToInsert),
            'text inserted properly'
          )
        )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => updateTextNodeIO(el, textToInsert) => ' +
  'rejects when no el',
  t => {
    t.plan(1)
    try {
      const insertTextAtCursor = sinon.spy()
      const el = null
      const textToInsert = 'bar'
      const { updateTextNodeIO } = getStubbedIo({insertTextAtCursor})
      updateTextNodeIO(el)(textToInsert)
        .cata(
          e => t.equals(
            e.message,
            'no el to insert text into',
            'proper error message'
          ),
          e => t.fail('io resolved on failure')
        )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => focusEventTargetIO(e) => ' +
  'prevents default and focuses event target',
  t => {
    t.plan(3)
    try {
      const e = {
        preventDefault: sinon.spy(),
        target: {
          focus: sinon.spy()
        }
      }
      const { focusEventTargetIO } = getStubbedIo({})
      focusEventTargetIO(e)
        .cata(
          e => t.fail('io failed', e),
          () => {
            t.ok(e.preventDefault.calledOnce, 'default prevented')
            t.ok(e.target.focus.calledOnce, 'target element focused')
            t.ok(e.target.focus.calledAfter(e.preventDefault), 'correct order')
          }
        )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => focusEventTargetIO(e) => ' +
  'rejects on error',
  t => {
    t.plan(1)
    try {
      const e = {
        preventDefault: sinon.stub().throws(new Error('I am an error')),
        target: {
          focus: sinon.spy()
        }
      }
      const { focusEventTargetIO } = getStubbedIo({})
      focusEventTargetIO(e)
        .cata(
          e => t.equals(e.message, 'I am an error', 'properly rejected'),
          () => t.fail('io resolved on failure')
        )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => dispatchActionIO(app, key, val) => ' +
  'dispatches action properly',
  t => {
    t.plan(1)
    try {
      const app = 'app'
      const key = 'key'
      const val = 'val'
      const dispatch = sinon.spy()
      const { dispatchActionIO } = getStubbedIo({dispatch})
      dispatchActionIO(app)(key)(val)
        .cata(
          e => t.fail('io failed', e),
          () => t.ok(
            dispatch.calledWith(app, key, val),
            'action dispatched properly'
          )
        )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => dispatchActionIO(app, key, val) => ' +
  'rejects on error',
  t => {
    t.plan(1)
    try {
      const app = 'app'
      const key = 'key'
      const val = 'val'
      const dispatch = sinon.stub().throws(new Error('I am an error'))
      const { dispatchActionIO } = getStubbedIo({dispatch})
      dispatchActionIO(app)(key)(val)
        .cata(
          e => t.equals(e.message, 'I am an error', 'rejects on failure'),
          e => t.fail('io resolved on failure')
        )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => updateStateIO(store, app, type, val) => ' +
  'updates state',
  t => {
    t.plan(1)
    try {
      const store = 'store'
      const app = 'app'
      const type = 'type'
      const val = 'val'
      const set = sinon.spy()
      const updateQueue = sinon.stub().withArgs(store, app).returns(set)
      const { updateStateIO } = getStubbedIo({updateQueue})
      updateStateIO(app)(store)(type)(val)
        .cata(
          e => t.fail('io failed', e),
          () => t.ok(set.calledWith(type, val), 'state set properly')
        )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => updateStateIO(store, app, type, val) => ' +
  'rejects on error',
  t => {
    t.plan(1)
    try {
      const store = 'store'
      const app = 'app'
      const type = 'type'
      const val = 'val'
      const set = sinon.stub().throws(new Error('I am an error'))
      const updateQueue = sinon.stub().withArgs(store, app).returns(set)
      const { updateStateIO } = getStubbedIo({updateQueue})
      updateStateIO(app)(store)(type)(val)
        .cata(
          e => t.equals(e.message, 'I am an error', 'proper error message'),
          () => t.fail('io passed on failure')
        )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => sendToBackgroundIO(msg) => ' +
  'updates state',
  t => {
    t.plan(1)
    try {
      const msg = 'I am a message'
      const sendToBackground = sinon.spy()
      const { sendToBackgroundIO } = getStubbedIo({sendToBackground})
      sendToBackgroundIO(msg)
        .cata(
          e => t.fail('io failed', e),
          () => t.ok(sendToBackground.calledWith(msg), 'state set properly')
        )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => sendToBackgroundIO(msg) => ' +
  'rejects on error',
  t => {
    t.plan(1)
    try {
      const msg = 'I am a message'
      const sendToBackground = sinon.stub().throws(new Error('I am an error'))
      const { sendToBackgroundIO } = getStubbedIo({sendToBackground})
      sendToBackgroundIO(msg)
        .cata(
          e => t.equals(e.message, 'I am an error', 'proper error message'),
          () => t.fail('io resolved on error')
        )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)
