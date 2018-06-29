const R = require('ramda')
const {
  compose,
  curry,
  join,
  add,
  merge,
  length
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
  findNewCursorPos: ctx => {
    return merge(ctx, {pos: calculateCursorPosition(ctx.searchterm, ctx.suggestions, ctx.selection)})
  },
  findSearchterm: curry((key, ctx) => {
    return merge(ctx, {searchterm: lastWordUpToCursor(ctx.selection, key)})
  })
}
