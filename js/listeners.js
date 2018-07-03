const { Identity } = require('monet')

const {
  getStoreKeyValue,
  getWindowSelection,
  getCursorOffset,
  updateTextNode,
  focusEventTarget,
  dispatchAction,
  dispatchSearchterm,
  dispatchPosition,
  sendSearchtermToBackground
} = require('./pipeline/transforms')
const { formatText, findNewCursorPos, findSearchterm } = require('./pipeline/formatters')

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
          .map(formatText)
          .map(findNewCursorPos)
          .chain(updateTextNode)
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
      initCtx({})
        .chain(hideBox)
        .cata(console.error, noop)
    },
    onKeypress (e) {
      if (/^[a-z0-9]$/i.test(e.key)) {
        initCtx({})
          .chain(getCursorOffset(e))
          .chain(getWindowSelection)
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
