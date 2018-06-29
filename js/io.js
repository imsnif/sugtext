const { curry } = require('ramda')
const { Right, Left } = require('monet')
const { offset } = require('caret-pos')
const { sendToBackground } = require('./msg-bus')

const { dispatch } = require('./dispatch')

const tryCatchify = effect => {
  try {
    return Right(effect())
  } catch (e) {
    return Left(e)
  }
}

module.exports = {
  getWindowSelectionIO: () => tryCatchify(window.getSelection),
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
  sendToBackgroundIO: msg => tryCatchify(() => sendToBackground(msg))
}
