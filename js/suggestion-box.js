const { el, list, text } = require('redom')

class Word {
  constructor () {
    this.el = el('li', {style: {
      color: '#5c573e',
      backgroundColor: '#9ba7c0',
      borderLeft: '5px solid #9ba7c0'
    }})
  }
  update ({word, selected}) {
    this.el.textContent = word
    if (selected) {
      this.el.style.backgroundColor = '#1c2321'
      this.el.style.borderLeft = '5px solid #1c2321'
      this.el.style.color = '#7d98a1'
    } else {
      this.el.style.backgroundColor = '#7d98a1',
      this.el.style.borderLeft = '5px solid #7d98a1'
      this.el.style.color = '#1c2321'
    }
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
            paddingLeft: 0
          }
        }),
        Word
      )
      this.el = el(
        'div',
        {
          style: {
            maxWidth: "200px",
            position: 'relative',
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
