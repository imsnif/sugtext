/* global browser */

'use strict'

const { Identity } = require('monet')

const { maybePropToCtx, readParallelToCtx } = require('./pipeline/transforms')
const { populateSuggestion } = require('./features/find-suggestion')
const { populateActiveTab, sendToTab } = require('./features/browser-tabs')
const {
  trimNewWord,
  calcWordScore,
  writeWordToUserDb
} = require('./features/update-user-words')
const { initDbs } = require('./features/init-dbs')

const commonEnglishWords = require('../common-words.json')

const consoleIfError = e => e && console.error(e.message ? e.message : e)
const noop = () => {}

browser.runtime.onMessage.addListener(msg => {
  Identity({})
    .chain(maybePropToCtx('appId', msg))
    .chain(maybePropToCtx('searchterm', msg))
    .chain(readParallelToCtx([
      populateSuggestion,
      populateActiveTab
    ]))
    .chain(ctx => sendToTab(
      ctx.suggestion,
      ctx.tabId,
      ctx.appId,
      ctx.searchterm
    ))
    .fork(consoleIfError, noop)
  Identity({})
    .chain(maybePropToCtx('newWord', msg))
    .map(trimNewWord)
    .chain(calcWordScore)
    .chain(writeWordToUserDb)
    .fork(consoleIfError, noop)
})

initDbs(commonEnglishWords)
