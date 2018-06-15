const { listen, dispatch } = require('./dispatch')
const textBoxListeners = require('./text-box-listeners')
const observe = require('./observe-dom')
const updateQueue = require('./update-queue')
const Store = require('@redom/store')
const { position, offset } = require('caret-pos')

module.exports = (app) => {
  const store = new Store();
  const set = updateQueue(store, app)
  const { onKeyDown, onBlur, onKeypress } = textBoxListeners(store, app)
  browser.runtime.onMessage.addListener(message => { // TODO: move elsewhere
    const { suggestions } = message
    set('visibility', 'visible')
    set('suggestions', suggestions)
    return Promise.resolve('foo')
  })
  listen(app, {
    async search (fullText) {
      const searchterm = fullText.split(/\s+/).pop() // TODO: get cursor position and work back from it
      browser.runtime.sendMessage({searchterm})
      set('searchterm', searchterm)
    },
    position (off) {
      const left = Number(off.left)
      const top = Number(off.top + off.height)
      set('position', {left, top})
    },
    visibility (val) {
      set('visibility', val)
    }
  })
  observe('div[contenteditable="true"]', el => {
    el.addEventListener('keypress', onKeypress)
    el.addEventListener('keydown', onKeyDown)
    el.addEventListener('blur', onBlur)
  })
}
