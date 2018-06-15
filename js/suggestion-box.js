const { el, list, text } = require('redom')

class Word {
  constructor () {
    this.el = el('li', {style: {
      color: 'white',
      zIndex: 10001 // might not need this?
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
            zIndex: 10000, // might not need this
            position: 'fixed',
            color: 'white',
            display: 'inline-block'
            // visibility: 'hidden'
          }
        },
        this.words
      )
    }
    update ({suggestions, position, visibility}) {
      if (suggestions) {
        this.words.update(suggestions)
      }
      if (position) {
        this.el.style.left = position.left + "px"
        this.el.style.top = position.top + "px"
      }
      if (visibility) {
        this.el.style.visibility = visibility
      }
    }
  }
}
