const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

function getStubbedFormatters ({extractChosenWord = sinon.stub()}) {
  return proxyquire('../../js/pipeline/formatters', {
    './text-manipulation': {extractChosenWord}
  })
}

test('UNIT => findTextToInsert(ctx) => formats text in ctx', t => {
  t.plan(1)
  try {
    const ctx = {searchterm: 'foo', suggestions: 'foobar'}
    const extractChosenWord = sinon.stub()
      .withArgs(ctx.suggestions)
      .returns('foobar')
    const { findTextToInsert } = getStubbedFormatters({extractChosenWord})
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
  'UNIT => formatSuggestions(suggestions, ctx) => orders suggestions in ctx',
  t => {
    t.plan(1)
    try {
      const suggestions = ['one', 'two', 'three', 'four', 'five']
      const ctx = {inverseSelection: false}
      const { formatSuggestions } = getStubbedFormatters({})
      t.deepEquals(formatSuggestions(suggestions)(ctx), Object.assign({}, ctx, {
        orderedSuggestions: suggestions
          .map((word, i) => ({word, selected: i === 0}))
      }), 'suggestions ordered in ctx')
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => formatSuggestions(suggestions, ctx) => inverses suggestions in ctx',
  t => {
    t.plan(1)
    try {
      const suggestions = ['one', 'two', 'three', 'four', 'five']
      const ctx = {inverseSelection: true}
      const { formatSuggestions } = getStubbedFormatters({})
      t.deepEquals(formatSuggestions(suggestions)(ctx), Object.assign({}, ctx, {
        orderedSuggestions: suggestions
          .reverse()
          .map((word, i) => ({word, selected: i === suggestions.length - 1}))
      }), 'suggestions inversely ordered in ctx')
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => findNewSelectedSuggestions(direction, ctx) => ' +
  'moves up selected in ctx',
  t => {
    t.plan(1)
    try {
      const suggestions = [
        {word: 'one', selected: false},
        {word: 'two', selected: true},
        {word: 'three', selected: false},
        {word: 'four', selected: false},
        {word: 'five', selected: false}
      ]
      const ctx = {suggestions}
      const { findNewSelectedSuggestions } = getStubbedFormatters({})
      t.deepEquals(findNewSelectedSuggestions('ArrowUp')(ctx),
        Object.assign({},
          ctx, {
            selectedSuggestions: suggestions.map((entry, i) => ({
              word: entry.word,
              selected: i === 0
            }))
          }
        ),
        'selection moved in suggestions in ctx'
      )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => findNewSelectedSuggestions(direction, ctx) => ' +
  'moves down selected in ctx',
  t => {
    t.plan(1)
    try {
      const suggestions = [
        {word: 'one', selected: false},
        {word: 'two', selected: true},
        {word: 'three', selected: false},
        {word: 'four', selected: false},
        {word: 'five', selected: false}
      ]
      const ctx = {suggestions}
      const { findNewSelectedSuggestions } = getStubbedFormatters({})
      t.deepEquals(findNewSelectedSuggestions('ArrowDown')(ctx),
        Object.assign({}, ctx, {
          selectedSuggestions: suggestions
            .map((entry, i) => ({word: entry.word, selected: i === 2}))
        }),
        'selection moved in suggestions in ctx'
      )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => findNewSelectedSuggestions(direction, ctx) => ' +
  'moves up selected in ctx (loops down if at first suggestions)',
  t => {
    t.plan(1)
    try {
      const suggestions = [
        {word: 'one', selected: true},
        {word: 'two', selected: false},
        {word: 'three', selected: false},
        {word: 'four', selected: false},
        {word: 'five', selected: false}
      ]
      const ctx = {suggestions}
      const { findNewSelectedSuggestions } = getStubbedFormatters({})
      t.deepEquals(findNewSelectedSuggestions('ArrowUp')(ctx),
        Object.assign({}, ctx, {
          selectedSuggestions: suggestions
            .map((entry, i) => ({word: entry.word, selected: i === 4}))
        }),
        'selection moved in suggestions in ctx'
      )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => findNewSelectedSuggestions(direction, ctx) => ' +
  'moves down selected in ctx (loops up if at last suggestions)',
  t => {
    t.plan(1)
    try {
      const suggestions = [
        {word: 'one', selected: false},
        {word: 'two', selected: false},
        {word: 'three', selected: false},
        {word: 'four', selected: false},
        {word: 'five', selected: true}
      ]
      const ctx = {suggestions}
      const { findNewSelectedSuggestions } = getStubbedFormatters({})
      t.deepEquals(findNewSelectedSuggestions('ArrowDown')(ctx),
        Object.assign({}, ctx, {
          selectedSuggestions: suggestions
            .map((entry, i) => ({word: entry.word, selected: i === 0}))
        }),
        'selection moved in suggestions in ctx'
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
      const { calcBoxHorizontalInverse } = getStubbedFormatters({})
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
      const { calcBoxHorizontalInverse } = getStubbedFormatters({})
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
      const { calcBoxVerticalInverse } = getStubbedFormatters({})
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
      const { calcBoxVerticalInverse } = getStubbedFormatters({})
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
      const { calcBoxPos } = getStubbedFormatters({})
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
      const { calcBoxPos } = getStubbedFormatters({})
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
      const { findNewCursorPos } = getStubbedFormatters({})
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
      const { findNewCursorPos } = getStubbedFormatters({})
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
      const { findSearchterm } = getStubbedFormatters({})
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
