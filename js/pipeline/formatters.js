const {
  curry,
  merge,
  prop,
  findIndex,
  last,
  split,
  slice,
  compose,
  toLower
} = require('ramda')

const {
  extractChosenWord
} = require('./text-manipulation')

module.exports = {
  findTextToInsert: ctx => {
    const chosenWord = extractChosenWord(ctx.suggestions)
    const { searchterm } = ctx
    const re = new RegExp('^' + searchterm)
    return merge(ctx, {textToInsert: chosenWord.replace(re, '')})
  },
  formatSuggestions: curry((suggestions, ctx) => {
    const orderedSuggestions = ctx.inverseSelection
      ? Array.from(suggestions)
        .reverse()
        .map((word, i) => ({word, selected: i === suggestions.length - 1}))
      : suggestions.map((word, i) => ({word, selected: i === 0}))
    return merge(ctx, {orderedSuggestions})
  }),
  findNewSelectedSuggestions: curry((direction, ctx) => {
    const currentSelected = findIndex(prop('selected'), ctx.suggestions)
    const selectedIndex = direction === 'ArrowUp' && currentSelected > 0
      ? currentSelected - 1
      : direction === 'ArrowUp' && currentSelected === 0
        ? ctx.suggestions.length - 1
        : direction === 'ArrowDown' && currentSelected < ctx.suggestions.length
          ? currentSelected + 1
          : 0
    const selectedSuggestions = ctx.suggestions.map(({word}, i) => {
      return {word, selected: i === selectedIndex}
    })
    return merge(ctx, {selectedSuggestions})
  }),
  calcBoxHorizontalInverse: curry((off, ctx) => {
    const { clientSize, appSize } = ctx
    const { left } = off
    const inverseHorizontal = (left + appSize.width) >= clientSize.clientWidth
    return merge(ctx, {inverseHorizontal})
  }),
  calcBoxVerticalInverse: curry((off, ctx) => {
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
  })
}
