const {
  curry,
  merge,
  prop,
  find,
  findIndex
} = require('ramda')

const {
  replaceSearchterm,
  calculateCursorPosition,
  lastWordUpToCursor
} = require('./text-manipulation')

module.exports = {
  formatText: ctx => {
    return merge(ctx, {text: replaceSearchterm(ctx.searchterm, ctx.suggestions, ctx.selection)})
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
    const inverseHorizontal = (off.left + ctx.appSize.width) >= ctx.clientSize.clientWidth
    return merge(ctx, {inverseHorizontal})
  }),
  calcBoxVerticalInverse: curry((off, ctx) => {
    const inverseVertical = (off.top + off.height + ctx.appSize.height) >= ctx.clientSize.clientHeight
    return merge(ctx, {inverseVertical})
  }),
  calcBoxPos: curry((off, ctx) => {
    const boxPos = {
      left: ctx.inverseHorizontal
        ? ctx.clientSize.clientWidth - ctx.appSize.width
        : off.left,
      top: ctx.inverseVertical
        ? off.top - ctx.appSize.height
        : off.top + off.height
    }
    return merge(ctx, {boxPos})
  }),
  findNewCursorPos: ctx => {
    return merge(ctx, {pos: calculateCursorPosition(ctx.searchterm, ctx.suggestions, ctx.selection)})
  },
  findSearchterm: curry((key, ctx) => {
    return merge(ctx, {searchterm: lastWordUpToCursor(ctx.selection, key)})
  })
}
