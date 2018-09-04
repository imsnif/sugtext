const { el, setStyle } = require('redom')

const style = {
  maxWidth: '200px',
  position: 'relative',
  margin: 0,
  paddingLeft: 0,
  backgroundColor: '#7d98a1',
  colorSearchterm: '#dfff00',
  colorCompletion: '#1c2321',
  display: 'inline-block'
}

class Word {
  constructor (props) {
    this.el = el('span')
    this.type = props.type
    this.word = null
  }
  update (word) {
    this.word = word
    if (!word) {
      this.el.textContent = ''
      this.el.style.visibility = 'hidden'
    } else {
      this.el.textContent = word
      setStyle(this.el, {
        visibility: 'visible',
        borderLeft: style.borderLeft,
        color: this.type === 'searchterm'
          ? style.colorSearchterm
          : style.colorCompletion
      })
    }
  }
}

module.exports = {Word}
