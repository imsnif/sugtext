const { curry } = require('ramda')
const { IO } = require('monet')
const { offset } = require('caret-pos')
const { sendToBackground } = require('./msg-bus')

const { dispatch } = require('./dispatch')

module.exports = {
  getWindowSelectionIO: () => IO(() => window.getSelection()),
  getFromStoreIO: curry((store, key) => {
    return IO(() => store.get(key))
  }),
  getCursorOffsetIO: el => IO(() => offset(el)),
  updateTextNodeIO: curry((text, pos, selection) => IO(() => {
    const range = document.createRange()
    const { anchorNode } = selection
    anchorNode.textContent = text
    range.setStart(anchorNode, pos)
    selection.removeAllRanges()
    selection.addRange(range)
  })),
  focusEventTargetIO: e => IO(() => {
    e.preventDefault()
    e.target.focus()
  }),
  dispatchActionIO: curry((app, key, val) => IO(() => dispatch(app, key, val))),
  sendToBackgroundIO: msg => IO(() => sendToBackground(msg))
}
