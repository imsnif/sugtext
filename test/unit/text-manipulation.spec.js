const test = require('tape')

const {
  lastWordBeforeIndex,
  appendToString,
  calculateCursorPosition,
  appendToLastWord,
  extractChosenWord,
  findStartOfWord
} = require('../../js/pipeline/text-manipulation')

test('UNIT => lastWordBeforeIndex(index, text) => returns last word', t => {
  t.plan(1)
  try {
    const index = 17
    const text = 'I am some text with some stuff - here are'
    t.equals(lastWordBeforeIndex(index)(text), 'wi', 'last word returned')
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => appendToString(char, string) => appends to string', t => {
  t.plan(1)
  try {
    const char = 'o'
    const string = 'fo'
    t.equals(appendToString(char)(string), 'foo', 'char appended')
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => calculateCursorPosition(searchterm, suggestions, selection) =>' +
  ' returns cursor index', t => {
  t.plan(1)
  try {
    const searchterm = 'foo'
    const suggestions = [
      {word: 'foobar', selected: true},
      {word: 'foolicious', selected: false}
    ]
    const selection = {anchorOffset: 5}
    t.equals(
      calculateCursorPosition(searchterm)(suggestions)(selection),
      8,
      'position returned'
    )
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => appendToLastWord(pos, char) => appends chart to last word', t => {
  t.plan(1)
  try {
    const pos = 8
    const char = 'f'
    t.equals(
      appendToLastWord(pos)(char)('aaaa'),
      'aaaaf',
      'last char appended'
    )
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => extractChosenWord(suggestions) => returns chosen sug', t => {
  t.plan(1)
  try {
    const suggestions = [
      {word: 'chosen', selected: true},
      {word: 'foo', selected: false},
      {word: 'bar', selected: false},
      {word: 'baz', selected: false}
    ]
    t.equals(
      extractChosenWord(suggestions),
      'chosen'
    )
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => findStartOfWord(selection, searchterm) => returns pos', t => {
  t.plan(1)
  try {
    const selection = {
      anchorOffset: 15
    }
    const searchterm = 'foobar'
    t.equals(
      findStartOfWord(selection)(searchterm),
      9,
      'returns proper offset'
    )
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})
