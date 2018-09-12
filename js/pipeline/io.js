const { curry } = require('ramda')
const { offset } = require('caret-pos')
const maxz = require('maxz')
const insertTextAtCursor = require('insert-text-at-cursor')
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
  getCursorOffsetIO: curry((el, pageScroll, spacePosition) => tryCatchify(() => {
    const elOffset = offset(
      el,
      el.type === 'textarea'
        ? {customPos: spacePosition}
        : {customPos: spacePosition, noShadowCaret: true}
    )
    return Object.assign({}, elOffset, {
      left: elOffset.left - pageScroll.x,
      top: elOffset.top - pageScroll.y
    })
  })),
  getSelectedTextareaCurPosIO: el => tryCatchify(() => {
    if (typeof (el.selectionStart) === 'undefined' || typeof (el.selectionEnd) === 'undefined') {
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
  getMaxZIndexIO: () => tryCatchify(() => {
    return maxz()
  }),
  updateTextNodeIO: curry((el, textToInsert) => tryCatchify(() => {
    if (!el) {
      throw new Error('no el to insert text into')
    }
    insertTextAtCursor(el, textToInsert)
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
