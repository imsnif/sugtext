const { curry, merge } = require('ramda')

const {
  getWindowSelectionIO,
  getFromStoreIO,
  getCursorOffsetIO,
  updateTextNodeIO,
  focusEventTargetIO,
  dispatchActionIO ,
  sendToBackgroundIO
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
  getCursorOffset: curry((event, ctx) => {
    const getOffsetVal = getCursorOffsetIO(event.target)
    return readToCtx(getOffsetVal, 'offset', ctx)
  }),
  updateTextNode: ctx => {
    const { text, pos, selection } = ctx
    const update = updateTextNodeIO(text, pos, selection)
    return returnCtx(update, ctx)
  },
  focusEventTarget: curry((e, ctx) => {
    return returnCtx(focusEventTargetIO(e), ctx)
  }),
  dispatchAction: curry((app, type, val) => {
    return returnCtx(dispatchActionIO(app, type, val))
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
  }
}
