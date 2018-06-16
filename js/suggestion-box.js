const { el, list, text } = require('redom')

class Word {
  constructor () {
    this.el = el('li', {style: {
      color: 'white'
    }})
  }
  update (data) {
    this.el.textContent = data
  }
}

module.exports = {
  SuggestionBox: class SuggestionBox {
    constructor () {
      this.words = list(
        el('ul', {
          style: {
            listStyleType: 'none',
            margin: 0,
            paddingLeft: '5px'
          }
        }),
        Word
      )
      this.el = el(
        'div',
        {
          style: {
            maxWidth: "200px",
            backgroundColor: 'blue',
            position: 'relative',
            color: 'white',
            display: 'inline-block'
          }
        },
        this.words
      )
    }
    update ({suggestions}) {
      if (suggestions) {
        this.words.update(suggestions)
      }
    }
  }
}
