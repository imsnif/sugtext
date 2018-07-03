const { el } = require('redom')
const { dispatch } = require('./dispatch')
const { SuggestionBox } = require('./suggestion-box')

const className = '.app'
const style = {
  position: 'fixed',
  zIndex: 10000 // TODO: dynamically
}

module.exports = class App {
  constructor () {
    this.suggestionBox = SuggestionBox()
    this.el = el(className,
      this.suggestionBox,
      {style}
    )
  }
  getBoundingClientRect () {
    return this.el.getBoundingClientRect()
  }
  _updatePosition (position) {
    this.el.style.left = `${position.left}px`
    this.el.style.top = `${position.top}px`
  }
  _updateVisibility (visibility) {
    this.el.style.visibility = visibility
  }
  update (data) {
    const { suggestions, position, visibility } = data
    if (suggestions) this.suggestionBox.update(suggestions)
    if (position) this._updatePosition(position)
    if (visibility) this._updateVisibility(visibility)
  }
}
