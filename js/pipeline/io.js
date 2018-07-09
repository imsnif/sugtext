const { curry } = require('ramda')
const { Right, Left } = require('monet')
const { offset } = require('caret-pos')
const { sendToBackground } = require('../util/msg-bus')
const updateQueue = require('../util/update-queue')

const { dispatch } = require('../util/dispatch')

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
  getCursorOffsetIO: curry((app, el) => tryCatchify(() => {
    const { anchorOffset } = window.getSelection()
    process.nextTick(() => dispatch(app, 'setCursorPos', anchorOffset + 1))
    return offset(el)
  })),
  updateTextNodeIO: curry((app, pos, textToInsert) => tryCatchify(() => {
    document.execCommand('insertText', false, textToInsert)
    process.nextTick(() => dispatch(app, 'setCursorPos', pos))
  })),
  updateCursorPositionIO: curry((pos, selection) => tryCatchify(() => {
    const range = document.createRange()
    const { anchorNode } = selection
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
