const {
  append,
  compose,
  curry,
  prop,
  length,
  last,
  find,
  join,
  add,
  split,
  slice
} = require('ramda')

const lastWordBeforeIndex = index => compose(
  last,
  split(/\s+/),
  slice(0, index)
)

const appendToString = char => compose(
  join(''),
  append(char)
)

const calculateCursorPosition = curry((searchterm, suggestions, selection) => {
  return add(
    compose(length, extractChosenWord)(suggestions),
    findStartOfWord(selection, searchterm)
  )
})

const appendToLastWord = curry((pos, char) => compose(
  appendToString(char),
  lastWordBeforeIndex(pos)
))

const extractChosenWord = compose(
  prop('word'),
  find(prop('selected'))
)

const findStartOfWord = curry((selection, searchterm) => {
  return selection.anchorOffset - searchterm.length
})

module.exports = {
  lastWordBeforeIndex,
  appendToString,
  calculateCursorPosition,
  appendToLastWord,
  extractChosenWord,
  findStartOfWord
}
