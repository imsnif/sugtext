const { curry } = require('ramda')
const { Right, Left } = require('monet')
const { offset } = require('caret-pos')
const { sendToBackground } = require('./msg-bus')
const updateQueue = require('./update-queue')

const { dispatch } = require('./dispatch')

const tryCatchify = effect => {
  try {
    return Right(effect())
  } catch (e) {
    return Left(e)
  }
}

module.exports = {
  getWindowSelectionIO: () => tryCatchify(() => window.getSelection()),
  getClientSizeIO: () => tryCatchify(() => {
    const { clientWidth, clientHeight } = document.body
    return { clientWidth, clientHeight }
  }),
  getAppSizeIO: app => tryCatchify(() => {
    return app.getBoundingClientRect()
  }),
  getFromStoreIO: curry((store, key) => {
    return tryCatchify(() => store.get(key))
  }),
  getCursorOffsetIO: el => tryCatchify(() => offset(el)),
  updateTextNodeIO: curry((text, pos, selection) => tryCatchify(() => {
    const range = document.createRange()
    const { anchorNode } = selection
    anchorNode.textContent = text
    range.setStart(anchorNode, pos)
    selection.removeAllRanges()
    selection.addRange(range)
  })),
  focusEventTargetIO: e => tryCatchify(() => {
    e.preventDefault()
    e.target.focus()
  }),
  dispatchActionIO: curry((app, key, val) => tryCatchify(() => dispatch(app, key, val))),
  updateStateIO: curry((store, app, type, val) => tryCatchify(() => {
    const set = updateQueue(store, app) // TODO: merge these two, or maybe just move update-queue here
    set(type, val)
  })),
  sendToBackgroundIO: msg => tryCatchify(() => sendToBackground(msg))
}
