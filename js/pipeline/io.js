const { curry, path } = require('ramda')
const { offset } = require('caret-pos')
const { sendToBackground } = require('../util/msg-bus')
const updateQueue = require('../util/update-queue')

const { dispatch } = require('../util/dispatch')

const { tryCatchify } = require('./wrapper')

module.exports = {
  getWindowSelectionIO: () => tryCatchify(() => window.getSelection()),
  getWindowScrollIO: el => tryCatchify(() => {
    if (el.type === 'textarea') {
      return {
        x: window.pageXOffset + document.body.scrollLeft,
        y: window.pageYOffset + document.body.scrollTop
      }
    } else {
      return {
        x: window.pageXOffset,
        y: window.pageYOffset
      }
    }
  }),
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
  getCursorOffsetIO: curry((app, el, pageScroll, curPos) => tryCatchify(() => {
    const elOffset = offset(el)
    // offset mutates the DOM so cursor position needs to be corrected in some edge cases
    process.nextTick(() => dispatch(app, 'setCursorPos', {pos: curPos + 1, el}))
    return Object.assign({}, elOffset, {
      left: elOffset.left - pageScroll.x,
      top: elOffset.top - pageScroll.y,
    })
  })),
  getSelectedTextareaCurPosIO: el => tryCatchify(() => {
    if (typeof(el.selectionStart) === 'undefined' || typeof(el.selectionEnd) === 'undefined') {
      throw new Error('element has no start and end positions')
    } else {
      return {start: el.selectionStart, end: el.selectionEnd}
    }
  }),
  getCurrentTextareaTextIO: el => tryCatchify(() => {
    if (typeof el === 'undefined') {
      throw new Error('no element to get text from')
    } else {
      return el.value
    }
  }),
  updateTextareaNodeIO: curry((app, el, initCurPos, pos, textToInsert) => tryCatchify(() => {
    const textUpToSelection = el.value.slice(0, initCurPos.start)
    const textAfterSelection = el.value.slice(initCurPos.end)
    const text = `${textUpToSelection}${textToInsert}${textAfterSelection}`
    el.value = text
    process.nextTick(() => dispatch(app, 'setCursorPos', {pos, el}))
  })),
  updateContentEditableNodeIO: curry((app, pos, textToInsert) => tryCatchify(() => {
    document.execCommand('insertText', false, textToInsert)
    process.nextTick(() => dispatch(app, 'setCursorPos', {pos}))
  })),
  updateCursorPositionInTextareaIO: curry((pos, el) => tryCatchify(() => {
    el.selectionStart = pos
    el.selectionEnd = pos
  })),
  updateCursorPositionInSelectionIO: curry((pos, selection) => tryCatchify(() => {
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
