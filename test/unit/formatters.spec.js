const test = require('tape')

test('UNIT => findTextToInsert(ctx) => formats text in ctx', t => {
  t.plan(1)
  try {
    const ctx = {searchterm: 'foo', suggestion: 'foobar'}
    const { findTextToInsert } = require('../../js/pipeline/formatters')
    t.deepEquals(findTextToInsert(ctx), Object.assign({}, ctx, {
      textToInsert: 'bar'
    }), 'textToInsert properly formatted in ctx')
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test(
  'UNIT => calcBoxHorizontalInverse(off, ctx) => ' +
  'properly sets horizontal inverse and places it in ctx',
  t => {
    t.plan(1)
    try {
      const clientSize = {
        clientWidth: 200
      }
      const appSize = {
        width: 100
      }
      const off = {
        left: 100
      }
      const ctx = {clientSize, appSize}
      const { calcBoxHorizontalInverse } = require('../../js/pipeline/formatters')
      t.deepEquals(calcBoxHorizontalInverse(off)(ctx),
        Object.assign({}, ctx, {inverseHorizontal: true}),
        'inverseHorizontal set to true in ctx'
      )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => calcBoxHorizontalInverse(off, ctx) => ' +
  'properly sets horizontal inverse (false) and places it in ctx',
  t => {
    t.plan(1)
    try {
      const clientSize = {
        clientWidth: 200
      }
      const appSize = {
        width: 99
      }
      const off = {
        left: 100
      }
      const ctx = {clientSize, appSize}
      const { calcBoxHorizontalInverse } = require('../../js/pipeline/formatters')
      t.deepEquals(calcBoxHorizontalInverse(off)(ctx),
        Object.assign({}, ctx, {inverseHorizontal: false}),
        'inverseHorizontal set to false in ctx'
      )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => calcBoxVerticalInverse(off, ctx) => ' +
  'properly sets vertical inverse and places it in ctx',
  t => {
    t.plan(1)
    try {
      const clientSize = {
        clientHeight: 200
      }
      const appSize = {
        height: 100
      }
      const off = {
        top: 90,
        height: 10
      }
      const ctx = {clientSize, appSize}
      const { calcBoxVerticalInverse } = require('../../js/pipeline/formatters')
      t.deepEquals(calcBoxVerticalInverse(off)(ctx),
        Object.assign({}, ctx, {inverseVertical: true}),
        'inverseVertical set to true in ctx'
      )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => calcBoxVerticalInverse(off, ctx) => ' +
  'properly sets vertical inverse (false) and places it in ctx',
  t => {
    t.plan(1)
    try {
      const clientSize = {
        clientHeight: 200
      }
      const appSize = {
        height: 100
      }
      const off = {
        top: 90,
        height: 9
      }
      const ctx = {clientSize, appSize}
      const { calcBoxVerticalInverse } = require('../../js/pipeline/formatters')
      t.deepEquals(calcBoxVerticalInverse(off)(ctx),
        Object.assign({}, ctx, {inverseVertical: false}),
        'inverseVertical set to false in ctx'
      )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => calcBoxPos(off, ctx) => ' +
  'properly sets box position and places it in ctx',
  t => {
    t.plan(1)
    try {
      const inverseHorizontal = false
      const inverseVertical = false
      const clientSize = {
        clientWidth: 200
      }
      const appSize = {
        height: 100,
        width: 10
      }
      const off = {
        top: 100,
        height: 9,
        left: 10
      }
      const ctx = {clientSize, appSize, inverseHorizontal, inverseVertical}
      const { calcBoxPos } = require('../../js/pipeline/formatters')
      t.deepEquals(calcBoxPos(off)(ctx),
        Object.assign({}, ctx, {boxPos: {
          left: off.left,
          top: off.top + off.height
        }}),
        'boxPos set properly in ctx'
      )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => calcBoxPos(off, ctx) => ' +
  'properly sets box position (with inverse values) and places it in ctx',
  t => {
    t.plan(1)
    try {
      const inverseHorizontal = true
      const inverseVertical = true
      const clientSize = {
        clientWidth: 200
      }
      const appSize = {
        height: 100,
        width: 10
      }
      const off = {
        top: 100,
        height: 9,
        left: 10
      }
      const ctx = {clientSize, appSize, inverseHorizontal, inverseVertical}
      const { calcBoxPos } = require('../../js/pipeline/formatters')
      t.deepEquals(calcBoxPos(off)(ctx),
        Object.assign({}, ctx, {boxPos: {
          left: clientSize.clientWidth - appSize.width,
          top: off.top - appSize.height
        }}),
        'boxPos set properly in ctx'
      )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => findNewCursorPos(ctx) => ' +
  'finds new cursor position and places it in ctx',
  t => {
    t.plan(1)
    try {
      const textToInsert = 'foo'
      const initCurPos = {start: 3, end: 3}
      const ctx = {textToInsert, initCurPos}
      const { findNewCursorPos } = require('../../js/pipeline/formatters')
      t.deepEquals(findNewCursorPos(ctx),
        Object.assign({}, ctx, {pos: 6}),
        'pos set properly in ctx'
      )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => findNewCursorPos(ctx) => ' +
  'finds new cursor position and places it in ctx (with no text to insert)',
  t => {
    t.plan(1)
    try {
      const textToInsert = ''
      const initCurPos = {start: 3, end: 3}
      const ctx = {textToInsert, initCurPos}
      const { findNewCursorPos } = require('../../js/pipeline/formatters')
      t.deepEquals(findNewCursorPos(ctx),
        Object.assign({}, ctx, {pos: 4}),
        'pos set properly in ctx'
      )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => findSearchterm(lastChar) => ' +
  'finds last word up to cursor, adds lastChar and places it in ctx',
  t => {
    t.plan(1)
    try {
      const initText = 'bar fo bar'
      const lastChar = 'o'
      const initCurPos = {start: 6, end: 6}
      const ctx = {initText, initCurPos}
      const { findSearchterm } = require('../../js/pipeline/formatters')
      t.deepEquals(findSearchterm(lastChar)(ctx),
        Object.assign({}, ctx, {searchterm: 'foo'}),
        'searchterm set properly in ctx'
      )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => findLastSpacePosition(ctx) => ' +
  'finds last space position and places it in ctx',
  t => {
    t.plan(1)
    try {
      const initText = 'bar fo bar'
      const initCurPos = {start: 10, end: 10}
      const ctx = {initText, initCurPos}
      const { findLastSpacePosition } = require('../../js/pipeline/formatters')
      t.deepEquals(findLastSpacePosition(ctx),
        Object.assign({}, ctx, {spacePosition: 7}),
        'spacePosition set properly in ctx'
      )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)
