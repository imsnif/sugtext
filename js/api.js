const { listen, dispatch } = require('./dispatch')
const listeners = require('./listeners')
const observe = require('./observe-dom')
const updateQueue = require('./update-queue')
const Store = require('@redom/store')
const { position, offset } = require('caret-pos')
const { sendToBackground, observeBackground } = require('./msg-bus')

module.exports = (app) => {
  const store = new Store();
  const set = updateQueue(store, app)
  const {
    onKeyDown,
    onBlur,
    onKeypress,
    onMsgFromBackground
  } = listeners(store, app)
  listen(app, {
    async search (searchterm) {
      set('searchterm', searchterm)
    },
    position (off) {
      const { clientWidth, clientHeight } = document.body
      const appRect = app.getBoundingClientRect()
      const inverseHorizontal = (off.left + appRect.width) >= clientWidth
      const inverseVertical = (off.top + off.height + appRect.height) >= clientHeight
      const pos = {
        left: inverseHorizontal
          ? clientWidth - appRect.width
          : off.left,
        top: inverseVertical
          ? off.top - appRect.height
          : off.top + off.height
      }
      set('position', pos)
      set('inverseSelection', inverseVertical)
    },
    visibility (val) {
      set('visibility', val)
    },
    suggest (suggestions) {
      const inverseSelection = store.get('inverseSelection')
      if (inverseSelection) {
        set('suggestions', 
          Array.from(suggestions)
          .reverse()
          .map((word, i) => ({word, selected: i === suggestions.length - 1}))
        )
      } else {
        set('suggestions', suggestions.map((word, i) => ({word, selected: i === 0})))
      }
    },
    moveSelection (direction) {
      const currentSuggestions = store.get('suggestions')
      const currentSelectedIndex = currentSuggestions.findIndex(sugg => sugg.selected)
      if (direction === 'ArrowUp') {
        const selectedIndex = currentSelectedIndex === 0 ? currentSelectedIndex : currentSelectedIndex - 1
        set('suggestions', currentSuggestions.map((suggestion, index) => ({word: suggestion.word, selected: index === selectedIndex})))
      } else if (direction === 'ArrowDown') {
        const selectedIndex = currentSelectedIndex === currentSuggestions.length ? currentSelectedIndex : currentSelectedIndex + 1
        set('suggestions', currentSuggestions.map((suggestion, index) => ({word: suggestion.word, selected: index === selectedIndex})))
      }
    }
  })
  observe('div[contenteditable="true"]', el => {
    el.addEventListener('keypress', onKeypress)
    el.addEventListener('keydown', onKeyDown)
    el.addEventListener('blur', onBlur)
  })
  observeBackground(onMsgFromBackground)
}
