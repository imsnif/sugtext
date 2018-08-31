'use strict'

const { el } = require('redom')
const { Word } = require('./word')

const className = '.sugtext'
const style = {
  position: 'fixed',
  display: 'none',
  backgroundColor: '#7d98a1',
  boxShadow: '0 0 0.2em 0.2em #7d98a1',
  borderRadius: '2px',
  zIndex: 10000 // TODO: dynamically
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
    const { suggestion, position, visibility, searchterm } = data
    if (suggestion) {
      const re = new RegExp(`^${searchterm}`)
      this.searchterm.update(searchterm)
      this.completion.update(suggestion.replace(re, ''))
    }
    if (position) this._updatePosition(position)
    if (visibility) this._updateVisibility(visibility)
  }
}
