const { Identity } = require('monet')

const {
  getStoreKeyValue,
  getWindowSelection,
  getCurrentCursorPos,
  getCurrentText,
  getCursorOffset,
  updateTextNode,
  focusEventTarget,
  dispatchAction,
  dispatchSearchterm,
  dispatchPosition,
  sendSearchtermToBackground,
  waitForEventLoop,
} = require('./pipeline/transforms')
const { findTextToInsert, findNewCursorPos, findSearchterm } = require('./pipeline/formatters')

const initCtx = Identity
const noop = () => {}

module.exports = (store, app) => {
  const getFromStore = getStoreKeyValue(store)
  const hideBox = dispatchAction(app, 'visibility', 'hidden')
  const showBox = dispatchAction(app, 'visibility', 'visible')
  const updateSuggestions = dispatchAction(app, 'suggest')
  const moveSelection = dispatchAction(app, 'moveSelection')
  return {
    onKeyDown (e) {
      if (store.get('visibility') !== 'visible') return
      if (e.key === 'Tab') {
        initCtx({})
          .chain(getFromStore('searchterm'))
          .chain(getFromStore('suggestions'))
          .chain(getWindowSelection)
          .chain(getCurrentCursorPos(e.target))
          .map(findTextToInsert)
          .map(findNewCursorPos)
          .chain(updateTextNode(app, e.target))
          .chain(focusEventTarget(e))
          .chain(hideBox)
          .cata(console.error, noop)
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        initCtx({})
          .chain(focusEventTarget(e))
          .chain(moveSelection(e.key))
          .cata(console.error, noop)
      } else {
        initCtx({})
          .chain(hideBox)
          .cata(console.error, noop)
      }
    },
    onBlur (e) {
      process.nextTick(() => {
        initCtx({})
          .chain(hideBox)
          .cata(console.error, noop)
      })
    },
    onKeypress (e) {
      if (/^[a-z0-9]$/i.test(e.key)) {
        initCtx({})
          .chain(getWindowSelection)
          .chain(getCurrentCursorPos(e.target))
          .chain(getCursorOffset(app, e))
          .chain(getCurrentText(e.target))
          .map(findSearchterm(e.key))
          .chain(dispatchPosition(app))
          .chain(dispatchSearchterm(app))
          .chain(sendSearchtermToBackground)
          .cata(console.error, noop)
      }
    },
    onMsgFromBackground ({suggestions}) {
      initCtx({})
        .chain(showBox)
        .chain(updateSuggestions(suggestions))
        .cata(console.error, noop)
    }
  }
}
