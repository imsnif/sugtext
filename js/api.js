const uuid = require('uuid/v4')
const { Identity } = require('monet')

const { listen } = require('./util/dispatch')
const listeners = require('./listeners')
const observe = require('./util/observe-dom')
const updateQueue = require('./util/update-queue')
const Store = require('@redom/store')
const { position, offset } = require('caret-pos')
const { sendToBackground, observeBackground } = require('./util/msg-bus')

const {
  getStoreKeyValue,
  getClientSize,
  updateState,
  updateStateFromCtx,
  getAppSize,
  getWindowSelection
} = require('./pipeline/transforms')
const {
  formatSuggestions,
  findNewSelectedSuggestions,
  calcBoxHorizontalInverse,
  calcBoxVerticalInverse,
  calcBoxPos
} = require('./pipeline/formatters')

const initCtx = Identity
const noop = () => {}

module.exports = (app) => {
  const store = new Store();
  const id = uuid()
  const updateAppState = updateState(store, app)
  const updateAppStateFromCtx = updateStateFromCtx(store, app)
  const getFromStore = getStoreKeyValue(store)
  const {
    onKeyDown,
    onBlur,
    onKeypress,
    onMsgFromBackground
  } = listeners(store, app, id)
  listen(app, {
    search (searchterm) {
      initCtx({})
        .chain(updateAppState('searchterm', searchterm))
        .cata(console.error, noop)
    },
    position (off) {
      initCtx({})
        .chain(getClientSize)
        .chain(getAppSize(app))
        .map(calcBoxHorizontalInverse(off))
        .map(calcBoxVerticalInverse(off))
        .map(calcBoxPos(off))
        .chain(updateAppStateFromCtx('boxPos', 'position'))
        .chain(updateAppStateFromCtx('inverseVertical', 'inverseSelection'))
        .cata(console.error, noop)
    },
    visibility (val) {
      initCtx({})
        .chain(updateAppState('visibility', val))
        .cata(console.error, noop)
    },
    suggest (suggestions) {
      initCtx({})
        .chain(getFromStore('inverseSelection'))
        .map(formatSuggestions(suggestions))
        .chain(updateAppStateFromCtx('orderedSuggestions', 'suggestions'))
        .cata(console.error, noop)
    },
    moveSelection (direction) {
      initCtx({})
        .chain(getFromStore('suggestions'))
        .map(findNewSelectedSuggestions(direction))
        .chain(updateAppStateFromCtx('selectedSuggestions', 'suggestions'))
        .cata(console.error, noop)
    }
  })
  observe('div[contenteditable="true"],textarea', el => {
    el.addEventListener('blur', onBlur)
    el.addEventListener('keypress', onKeypress)
    el.addEventListener('keydown', onKeyDown)
  })
  observeBackground(onMsgFromBackground)
}
