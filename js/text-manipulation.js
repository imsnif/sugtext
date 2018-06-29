const {
  append,
  compose,
  curry,
  remove,
  prop,
  length,
  last,
  path,
  find,
  insertAll,
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

const replaceSearchterm = curry((searchterm, suggestions, selection) => {
  const removed = removeSearchtermFromText(searchterm, selection)
  return compose(
    join(''),
    insertChosenWordIntoText(searchterm, selection, suggestions)
  )(removed)
})

const calculateCursorPosition = curry((searchterm, suggestions, selection) => {
  return add(
    compose(length, extractChosenWord)(suggestions),
    findStartOfWord(selection, searchterm)
  )
})

const appendToLastWord = (pos, char) => compose(
  appendToString(char),
  lastWordBeforeIndex(pos)
)

const lastWordUpToCursor = (selection, char) => {
  const { anchorNode, anchorOffset } = selection
  const { textContent } = anchorNode
  const appendChar = appendToLastWord(anchorOffset, char)
  return appendChar(textContent)
}

const extractChosenWord = compose(
  prop('word'),
  find(prop('selected'))
)

const insertChosenWordIntoText = curry(
  (searchterm, selection, suggestions, text) => {
    const startPos = findStartOfWord(selection, searchterm)
    const chosenSuggestion = extractChosenWord(suggestions)
    return insertAll(startPos, chosenSuggestion, text)
  }
)

const findStartOfWord = curry((selection, searchterm) => {
  return selection.anchorOffset - searchterm.length
})

const removeSearchtermFromText = curry((searchterm, selection) => {
  const startPos = findStartOfWord(selection, searchterm)
  const searchtermEndPos = length(searchterm)
  const origText = path(['anchorNode', 'textContent'], selection)
  return remove(startPos, searchtermEndPos, origText)
})

module.exports = {
  lastWordBeforeIndex,
  appendToString,
  replaceSearchterm,
  calculateCursorPosition,
  appendToLastWord,
  lastWordUpToCursor,
  extractChosenWord,
  insertChosenWordIntoText,
  findStartOfWord,
  removeSearchtermFromText
}
