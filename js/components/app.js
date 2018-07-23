'use strict'

const { el } = require('redom')
const { SuggestionBox } = require('./suggestion-box')
const { InstructionLine } = require('./instruction-line')

const className = '.sugtext'
const style = {
  position: 'fixed',
  display: 'none',
  zIndex: 10000 // TODO: dynamically
}

module.exports = class App {
  constructor () {
    this.suggestionBox = SuggestionBox()
    this.el = el(className,
      this.suggestionBox,
      InstructionLine(),
      {style}
    )
  }
  getBoundingClientRect () {
    return this.el.getBoundingClientRect()
  }
  _updatePosition (position) {
    this.el.style.left = `${Number(position.left)}px`
    this.el.style.top = `${Number(position.top)}px`
  }
  _updateVisibility (visibility) {
    this.el.style.display = visibility === 'hidden' ? 'none' : 'initial'
  }
  update (data) {
    const { suggestions, position, visibility } = data
    if (suggestions) this.suggestionBox.update(suggestions)
    if (position) this._updatePosition(position)
    if (visibility) this._updateVisibility(visibility)
  }
}
