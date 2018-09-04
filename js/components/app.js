'use strict'

const { el } = require('redom')
const { Word } = require('./word')

const className = '.sugtext'
const style = {
  position: 'fixed',
  display: 'none',
  backgroundColor: '#7d98a1',
  boxShadow: '0 0 0.2em 0.2em #7d98a1',
  borderRadius: '2px'
}

module.exports = class App {
  constructor () {
    this.searchterm = new Word({type: 'searchterm'})
    this.completion = new Word({type: 'completion'})
    this.el = el(className,
      this.searchterm,
      this.completion,
      {style}
    )
    this.zIndex = 1
  }
  getBoundingClientRect () {
    const origDisplay = this.el.style.display
    const origSearchterm = this.searchterm.word
    if (!origSearchterm) {
      // so that the box has minimal size
      this.searchterm.update('W')
    }
    this.el.style.display = 'initial'
    const rect = this.el.getBoundingClientRect()
    this.el.style.display = origDisplay
    this.searchterm.update(origSearchterm)
    return rect
  }
  _updatePosition (position) {
    this.el.style.left = `${Number(position.left)}px`
    this.el.style.top = `${Number(position.top)}px`
  }
  _updateVisibility (visibility) {
    this.el.style.display = visibility === 'hidden' ? 'none' : 'initial'
    this.el.style.zIndex = this.zIndex
  }
  update (data) {
    const { suggestion, position, visibility, searchterm, maxZIndex } = data
    if (maxZIndex) {
      this.zIndex = maxZIndex + 1
    }
    if (suggestion) {
      const re = new RegExp(`^${searchterm}`)
      this.searchterm.update(searchterm)
      this.completion.update(suggestion.replace(re, ''))
    }
    if (position) this._updatePosition(position)
    if (visibility) this._updateVisibility(visibility)
  }
}
