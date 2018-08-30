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

const R = require('ramda')

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
    const mapIndex = R.addIndex(R.map)
    const padSuggestions = suggestions => R.insertAll(
      0,
      R.repeat({}, 5 - suggestions.length),
      suggestions
    )
    const orderedSuggestions = ctx.inverseSelection
      ? R.compose(
        padSuggestions,
        mapIndex((word, i) => ({word, selected: i === suggestions.length - 1})),
        R.reverse
      )(suggestions)
      : suggestions.map((word, i) => ({word, selected: i === 0}))
    return merge(ctx, {orderedSuggestions})
  }),
  findNewSelectedSuggestions: curry((direction, ctx) => {
    const currentSelected = findIndex(prop('selected'), ctx.suggestions)
    const nonPaddedSuggestions = ctx.suggestions.filter(sug => sug.word)
    const highestIndex = ctx.suggestions.length - 1
    const lowestIndex = highestIndex - (nonPaddedSuggestions.length - 1)
    const selectedIndex = direction === 'ArrowUp'
      ? (currentSelected > lowestIndex ? currentSelected - 1 : highestIndex)
      : (currentSelected < highestIndex ? currentSelected + 1 : lowestIndex)
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
    const lastSpacePosition = R.lastIndexOf(' ', initText.slice(0, initCurPos.end))
    return merge(ctx, {
      spacePosition: lastSpacePosition === -1
        ? 0
        : lastSpacePosition + 1
    })
  }
}
