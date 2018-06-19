const { el } = require('redom')
const { dispatch } = require('./dispatch')
const { SuggestionBox } = require('./suggestion-box')

module.exports = class App {
  constructor () {
    this.el = el('.app',
      this.suggestionBox = new SuggestionBox(),
      {
        style: {
          position: 'fixed',
          zIndex: 10000 // TODO: dynamically
        }
      }
    )
    this.data = {};
  }
  getBoundingClientRect () {
    return this.el.getBoundingClientRect()
  }
  update (data) {
    const { suggestions, position, visibility } = data;
    this.suggestionBox.update({suggestions});
    if (position) {
      this.el.style.left = position.left
      this.el.style.top = position.top
    }
    if (visibility) {
      this.el.style.visibility = visibility
    }
    this.data = data;
  }
}
