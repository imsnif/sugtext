const { Identity } = require('monet')

const {
  getStoreKeyValue,
  getWindowSelection,
  getWindowScroll,
  getCurrentCursorPos,
  getCurrentText,
  getCursorOffset,
  updateTextNode,
  focusEventTarget,
  dispatchAction,
  dispatchSearchterm,
  dispatchPosition,
  sendSearchtermToBackground,
  sendAcceptedToBackground,
  sendNewWordToBackground
} = require('./pipeline/transforms')
const {
  findTextToInsert,
  findSearchterm,
  findLastSpacePosition
} = require('./pipeline/formatters')

const initCtx = Identity
const noop = () => {}

module.exports = (store, app, id) => {
  const getFromStore = getStoreKeyValue(store)
  const hideBox = dispatchAction(app, 'visibility', 'hidden')
  const showBox = dispatchAction(app, 'visibility', 'visible')
  const updateSuggestion = dispatchAction(app, 'suggest')
  return {
    onKeyDown (e) {
      if (store.get('visibility') !== 'visible') return
      if (e.key === 'Tab') {
        initCtx({})
          .chain(getFromStore('searchterm'))
          .chain(getFromStore('suggestion'))
          .map(findTextToInsert)
          .chain(updateTextNode(e.target))
          .chain(focusEventTarget(e))
          .chain(hideBox)
          .chain(sendAcceptedToBackground(id))
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
      const isPartOfCombo = e.altKey || e.ctrlKey || e.metaKey
      if (isPartOfCombo) return
      if (/^[a-z0-9]$/i.test(e.key)) {
        initCtx({})
          .chain(getWindowSelection)
          .chain(getCurrentCursorPos(e.target))
          .chain(getWindowScroll(e.target))
          .chain(getCurrentText(e.target))
          .map(findLastSpacePosition)
          .chain(getCursorOffset(e))
          .map(findSearchterm(e.key))
          .chain(dispatchPosition(app))
          .chain(sendSearchtermToBackground(id))
          .cata(console.error, noop)
      } else if (e.key === ' ') {
        initCtx({})
          .chain(getWindowSelection)
          .chain(getWindowScroll(e.target))
          .chain(getCursorOffset(e))
          .chain(getCurrentCursorPos(e.target))
          .chain(getCurrentText(e.target))
          .map(findSearchterm(''))
          .chain(sendNewWordToBackground(id))
          .chain(hideBox)
          .cata(console.error, noop)
      }
    },
    onMsgFromBackground ({appId, suggestion, searchterm}) {
      if (appId === id) {
        initCtx({})
          .chain(showBox)
          .chain(updateSuggestion(suggestion))
          .chain(dispatchSearchterm(app, searchterm))
          .cata(console.error, noop)
      } else {
        initCtx({})
          .chain(hideBox)
          .cata(console.error, noop)
      }
    }
  }
}
