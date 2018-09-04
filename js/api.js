const uuid = require('uuid/v4')
const { Identity } = require('monet')
const debounce = require('debounce')

const { listen } = require('./util/dispatch')
const listeners = require('./listeners')
const observe = require('./util/observe-dom')
const Store = require('@redom/store')
const { observeBackground } = require('./util/msg-bus')

const {
  getClientSize,
  updateState,
  updateStateFromCtx,
  getAppSize,
  getMaxZIndex
} = require('./pipeline/transforms')
const {
  calcBoxHorizontalInverse,
  calcBoxVerticalInverse,
  calcBoxPos
} = require('./pipeline/formatters')

const initCtx = Identity
const noop = () => {}

module.exports = (app) => {
  const store = new Store()
  const id = uuid()
  const updateAppState = updateState(store, app)
  const updateAppStateFromCtx = updateStateFromCtx(store, app)
  const updateMaxZIndex = debounce(() => {
    initCtx({})
      .chain(getMaxZIndex)
      .chain(updateAppStateFromCtx('maxZIndex', 'maxZIndex'))
      .cata(console.error, noop)
  }, 100)
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
        .cata(console.error, noop)
    },
    visibility (val) {
      initCtx({})
        .chain(updateAppState('visibility', val))
        .cata(console.error, noop)
    },
    suggest (suggestion) {
      initCtx({})
        .chain(updateAppState('suggestion', suggestion))
        .cata(console.error, noop)
    }
  })
  observe('div[contenteditable="true"],textarea', el => {
    updateMaxZIndex()
    el.addEventListener('blur', onBlur)
    el.addEventListener('click', onBlur) // TODO: rename function
    el.addEventListener('keypress', onKeypress)
    el.addEventListener('keydown', onKeyDown)
  })
  observeBackground(onMsgFromBackground)
}
