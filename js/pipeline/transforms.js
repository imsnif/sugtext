const { Left, Right, Identity } = require('monet')
const { curry, merge } = require('ramda')

const {
  getWindowSelectionIO,
  getClientSizeIO,
  getAppSizeIO,
  getFromStoreIO,
  getCursorOffsetIO,
  updateTextNodeIO,
  focusEventTargetIO,
  dispatchActionIO ,
  sendToBackgroundIO,
  updateStateIO,
  waitForEventLoopIO,
  updateCursorPositionIO
} = require('./io')

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
  getClientSize: ctx => {
    return readToCtx(getClientSizeIO(), 'clientSize', ctx)
  },
  getAppSize: curry((app, ctx) => {
    return readToCtx(getAppSizeIO(app), 'appSize', ctx)
  }),
  getCursorOffset: curry((app, event, ctx) => {
    const getOffsetVal = getCursorOffsetIO(app, event.target)
    return readToCtx(getOffsetVal, 'offset', ctx)
  }),
  updateTextNode: curry((app, ctx) => {
    const { textToInsert, pos } = ctx
    const update = updateTextNodeIO(app, pos, textToInsert)
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
  sendSearchtermToBackground: ctx => {
    const { searchterm } = ctx
    const send = sendToBackgroundIO({searchterm})
    return returnCtx(send, ctx)
  },
  updateCursorPosition: curry((pos, ctx) => {
    return returnCtx(updateCursorPositionIO(pos, ctx.selection), ctx)
  })
}
