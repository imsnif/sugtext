const {
  curry,
  merge,
  last,
  split,
  slice,
  compose,
  toLower
} = require('ramda')

const R = require('ramda')

module.exports = {
  findTextToInsert: ctx => {
    const { suggestion, searchterm } = ctx
    const re = new RegExp('^' + searchterm)
    return merge(ctx, {textToInsert: suggestion.replace(re, '')})
  },
  calcBoxHorizontalInverse: curry((off, ctx) => {
    const { clientSize, appSize } = ctx
    const { left } = off
    const inverseHorizontal = (left + appSize.width) >= clientSize.clientWidth
    return merge(ctx, {inverseHorizontal})
  }),
  calcBoxVerticalInverse: curry((off, ctx) => {
    // TODO: compensate for pageScroll
    const { appSize, clientSize } = ctx
    const { top, height } = off
    const inverseVertical = (top + height + appSize.height) >= clientSize.clientHeight
    return merge(ctx, {inverseVertical})
  }),
  calcBoxPos: curry((off, ctx) => {
    const { inverseHorizontal, inverseVertical, clientSize, appSize } = ctx
    const { left, top, height } = off
    const boxPos = {
      left: inverseHorizontal
        ? clientSize.clientWidth - appSize.width
        : left,
      top: inverseVertical
        ? top - appSize.height
        : top + height
    }
    return merge(ctx, {boxPos})
  }),
  findNewCursorPos: ctx => {
    const { textToInsert, initCurPos } = ctx
    const offset = textToInsert.length > 0 ? textToInsert.length : 1
    return merge(ctx, {pos: initCurPos.end + offset})
  },
  findSearchterm: curry((lastChar, ctx) => {
    const { initCurPos, initText } = ctx
    const getLastWord = compose(
      toLower,
      last,
      split(/\s+/),
      slice(0, initCurPos.end)
    )
    const lastWord = getLastWord(initText)
    return merge(ctx, {searchterm: lastWord + lastChar})
  }),
  findLastSpacePosition: ctx => {
    const { initText, initCurPos } = ctx
    const lastSpacePosition = R.findLastIndex(
      R.test(/\s/),
      initText.slice(0, initCurPos.end)
    )
    return merge(ctx, {
      spacePosition: lastSpacePosition === -1
        ? 0
        : lastSpacePosition + 1
    })
  }
}
