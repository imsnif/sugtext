const { el } = require('redom')

const style = {
  selected: {
    backgroundColor: '#1c2321',
    borderLeft: '5px solid #1c2321',
    color: '#7d98a1'
  },
  unselected: {
    backgroundColor: '#7d98a1',
    borderLeft: '5px solid #7d98a1',
    color: '#1c2321'
  }
}

class Word {
  constructor (props) {
    this.el = el('li')
  }
  update ({word, selected}) {
    this.el.textContent = word
    const styleData = selected ? style.selected : style.unselected
    this.el.style.backgroundColor = styleData.backgroundColor
    this.el.style.borderLeft = styleData.borderLeft
    this.el.style.color = styleData.color
  }
}

module.exports = {Word}
