const Future = require('fluture')
const { Identity, Maybe, Left, Right } = require('monet')
const R = require('ramda')
const { curry, merge } = R

const {
  getWindowSelectionIO,
  getWindowScrollIO,
  getSelectedTextareaCurPosIO,
  getCurrentTextareaTextIO,
  getClientSizeIO,
  getAppSizeIO,
  getFromStoreIO,
  getCursorOffsetIO,
  getMaxZIndexIO,
  updateTextNodeIO,
  focusEventTargetIO,
  dispatchActionIO,
  sendToBackgroundIO,
  updateStateIO
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
  getCursorOffset: curry((e, ctx) => {
    const { pageScroll, spacePosition } = ctx
    const getOffsetVal = getCursorOffsetIO(e.target, pageScroll, spacePosition)
    return readToCtx(getOffsetVal, 'offset', ctx)
  }),
  getMaxZIndex: ctx => {
    return readToCtx(getMaxZIndexIO(), 'maxZIndex', ctx)
  },
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
    if (typeof value === 'undefined') {
      return Left(new Error(`no such value ${ctxKey} in ctx`))
    }
    return returnCtx(updateStateIO(app, store, key, value), ctx)
  }),
  dispatchSearchterm: curry((app, searchterm, ctx) => {
    const dispatch = dispatchActionIO(app, 'search', searchterm)
    return returnCtx(dispatch, ctx)
  }),
  dispatchPosition: curry((app, ctx) => {
    const dispatch = dispatchActionIO(app, 'position', ctx.offset)
    return returnCtx(dispatch, ctx)
  }),
  sendSearchtermToBackground: curry((appId, ctx) => {
    const { searchterm } = ctx
    const send = searchterm.length >= 2
      ? sendToBackgroundIO({appId, searchterm})
      : Right()
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
  maybePropToCtx: R.curry((prop, obj, ctx) => {
    return Identity(obj)
      .chain(R.compose(
        Maybe.fromNull,
        R.prop(prop)
      ))
      .map(R.compose(
        R.merge(ctx),
        R.objOf(prop)
      ))
      .orElse(Future.reject())
  }),
  readParallelToCtx: R.curry((parallelTasks, ctx) => {
    return Future.parallel(parallelTasks.length,
      parallelTasks.map(t => t(ctx))
    ).map(R.compose(
      R.merge(ctx),
      R.mergeAll
    ))
  })
}
