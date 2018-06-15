const { el } = require('redom')
const { dispatch } = require('./dispatch')
const { SuggestionBox } = require('./suggestion-box')

module.exports = class App {
  constructor () {
    this.el = el('.app',
      this.suggestionBox = new SuggestionBox(), // TODO: move to this.el
    )
    this.data = {};
  }
  update (data) {
    const { suggestions, position, visibility } = data;
    this.suggestionBox.update({suggestions, position, visibility});
    this.data = data;
  }
}
