const { el } = require('redom')

const style = {
  selected: {
    backgroundColor: '#3d3f40',
    borderLeft: '5px solid #3d3f40',
    color: '#dfff00'
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
    if (!word) {
      this.el.style.textContent = 'N/A'
      this.el.style.visibility = 'hidden'
    } else {
      this.el.textContent = word
      const styleData = selected ? style.selected : style.unselected
      this.el.style.backgroundColor = styleData.backgroundColor
      this.el.style.borderLeft = styleData.borderLeft
      this.el.style.color = styleData.color
    }
  }
}

module.exports = {Word}
