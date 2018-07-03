const { Identity } = require('monet')

const { listen, dispatch } = require('./dispatch')
const listeners = require('./listeners')
const observe = require('./observe-dom')
const updateQueue = require('./update-queue')
const Store = require('@redom/store')
const { position, offset } = require('caret-pos')
const { sendToBackground, observeBackground } = require('./msg-bus')

const {
  getStoreKeyValue,
  getClientSize,
  updateState,
  updateStateFromCtx,
  getAppSize
} = require('./transforms')
const {
  formatSuggestions,
  findNewSelectedSuggestions,
  calcBoxHorizontalInverse,
  calcBoxVerticalInverse,
  calcBoxPos
} = require('./formatters')

const initCtx = Identity
const noop = () => {}

module.exports = (app) => {
  const store = new Store();
  const set = updateQueue(store, app)
  const updateAppState = updateState(store, app)
  const updateAppStateFromCtx = updateStateFromCtx(store, app)
  const getFromStore = getStoreKeyValue(store)
  const {
    onKeyDown,
    onBlur,
    onKeypress,
    onMsgFromBackground
  } = listeners(store, app)
  listen(app, {
    async search (searchterm) {
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
  observe('div[contenteditable="true"]', el => {
    el.addEventListener('keypress', onKeypress)
    el.addEventListener('keydown', onKeyDown)
    el.addEventListener('blur', onBlur)
  })
  observeBackground(onMsgFromBackground)
}
