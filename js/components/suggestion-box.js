const { el, list, text } = require('redom')

const { Word } = require('./word')

const style = {
  maxWidth: "200px",
  position: 'relative',
  listStyleType: 'none',
  margin: 0,
  paddingLeft: 0
}

module.exports = {SuggestionBox: () => list(el('ul', {style}), Word)}
