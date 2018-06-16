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
      const left = Number(off.left)
      const top = Number(off.top + off.height)
      set('position', {left, top})
    },
    visibility (val) {
      set('visibility', val)
    },
    suggest (suggestions) {
      set('suggestions', suggestions)
    }
  })
  observe('div[contenteditable="true"]', el => {
    el.addEventListener('keypress', onKeypress)
    el.addEventListener('keydown', onKeyDown)
    el.addEventListener('blur', onBlur)
  })
  observeBackground(onMsgFromBackground)
}
