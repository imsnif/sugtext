const { Left } = require('monet')
const { curry, merge } = require('ramda')

const {
  getWindowSelectionIO,
  getWindowScrollIO,
  getSelectedTextareaCurPosIO,
  getCurrentTextareaTextIO,
  getClientSizeIO,
  getAppSizeIO,
  getFromStoreIO,
  getCursorOffsetIO,
  updateTextNodeIO,
  focusEventTargetIO,
  dispatchActionIO,
  sendToBackgroundIO,
  updateStateIO,
  updateCursorPositionInTextareaIO,
  updateCursorPositionInSelectionIO
} = require('./io')

const {
  getTextFromSelection,
  getPosFromSelection
} = require('./arrange-data')

const readToCtx = curry((ioAction, key, ctx) => {
  return ioAction.map(val => merge(ctx, {[key]: val}))
})
const returnCtx = curry((ioAction, ctx) => ioAction.map(() => ctx))

module.exports = {
  getStoreKeyValue: curry((store, key, ctx) => {
    const readVal = getFromStoreIO(store, key)
    return readToCtx(readVal, key, ctx)
  }),
  getWindowSelection: ctx => readToCtx(getWindowSelectionIO(), 'selection', ctx),
  getWindowScroll: curry((el, ctx) => readToCtx(getWindowScrollIO(el), 'pageScroll', ctx)),
  getCurrentCursorPos: curry((el, ctx) => {
    const { selection } = ctx
    const getPosition = el.type === 'textarea'
      ? getSelectedTextareaCurPosIO(el)
      : getPosFromSelection(selection)
    return readToCtx(getPosition, 'initCurPos', ctx)
  }),
  getCurrentText: curry((el, ctx) => {
    const { selection } = ctx
    const getText = el.type === 'textarea'
      ? getCurrentTextareaTextIO(el)
      : getTextFromSelection(selection)
    return readToCtx(getText, 'initText', ctx)
  }),
  getClientSize: ctx => {
    return readToCtx(getClientSizeIO(), 'clientSize', ctx)
  },
  getAppSize: curry((app, ctx) => {
    return readToCtx(getAppSizeIO(app), 'appSize', ctx)
  }),
  getCursorOffset: curry((app, event, ctx) => {
    const { initCurPos, pageScroll } = ctx
    const getOffsetVal = getCursorOffsetIO(app, event.target, pageScroll, initCurPos.end)
    return readToCtx(getOffsetVal, 'offset', ctx)
  }),
  updateTextNode: curry((el, ctx) => {
    const { textToInsert } = ctx
    const update = updateTextNodeIO(el, textToInsert)
    return returnCtx(update, ctx)
  }),
  focusEventTarget: curry((e, ctx) => {
    return returnCtx(focusEventTargetIO(e), ctx)
  }),
  dispatchAction: curry((app, type, val, ctx) => {
    return returnCtx(dispatchActionIO(app, type, val), ctx)
  }),
  updateState: curry((app, store, type, val, ctx) => {
    return returnCtx(updateStateIO(app, store, type, val), ctx)
  }),
  updateStateFromCtx: curry((app, store, ctxKey, key, ctx) => {
    const value = ctx[ctxKey]
    if (typeof value === 'undefined') return Left(`no such value ${ctxKey} in ctx`)
    return returnCtx(updateStateIO(app, store, key, value), ctx)
  }),
  dispatchSearchterm: curry((app, ctx) => {
    const dispatch = dispatchActionIO(app, 'search', ctx.searchterm)
    return returnCtx(dispatch, ctx)
  }),
  dispatchPosition: curry((app, ctx) => {
    const dispatch = dispatchActionIO(app, 'position', ctx.offset)
    return returnCtx(dispatch, ctx)
  }),
  sendSearchtermToBackground: curry((appId, ctx) => {
    const { searchterm } = ctx
    const send = sendToBackgroundIO({appId, searchterm})
    return returnCtx(send, ctx)
  }),
  sendAcceptedToBackground: curry((appId, ctx) => {
    const { searchterm, textToInsert } = ctx
    const send = sendToBackgroundIO({appId, newWord: searchterm + textToInsert})
    return returnCtx(send, ctx)
  }),
  sendNewWordToBackground: curry((appId, ctx) => {
    const { searchterm } = ctx
    const send = sendToBackgroundIO({appId, newWord: searchterm})
    return returnCtx(send, ctx)
  }),
  updateCursorPosition: curry((pos, el, ctx) => {
    const { selection } = ctx
    const update = el && el.type === 'textarea'
      ? updateCursorPositionInTextareaIO(pos, el)
      : updateCursorPositionInSelectionIO(pos, el, selection)
    return returnCtx(update, ctx)
  })
}
