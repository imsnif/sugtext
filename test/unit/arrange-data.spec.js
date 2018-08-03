const test = require('tape')

const {
  getTextFromSelection,
  getPosFromSelection
} = require('../../js/pipeline/arrange-data')

test('UNIT => getTextFromSelection(selection) => resolves text', t => {
  t.plan(1)
  try {
    const selection = {anchorNode: {textContent: 'foo'}}
    getTextFromSelection(selection)
      .cata(
        e => t.fail('text not resolved'),
        text => t.equals(text, selection.anchorNode.textContent, 'text resolved')
      )
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => getTextFromSelection(selection) => errors properly', t => {
  t.plan(1)
  try {
    const selection = {}
    getTextFromSelection(selection)
      .cata(
        e => t.equals(e.message, 'no textContent in selection', 'correct error'),
        () => t.fail('resolved with no textContent')
      )
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => getPosFromSelection(selection) => resolves text', t => {
  t.plan(1)
  try {
    const selection = {anchorOffset: 42}
    getPosFromSelection(selection)
      .cata(
        e => t.fail('pos not resolved'),
        pos => t.deepEquals(pos, {start: 42, end: 42}, 'pos resolved')
      )
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => getPosFromSelection(selection) => errors properly', t => {
  t.plan(1)
  try {
    const selection = null
    getPosFromSelection(selection)
      .cata(
        e => t.equals(e.message,
          'no selection to get cursor position from',
          'correct error'),
        () => t.fail('resolved with no textContent')
      )
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})
