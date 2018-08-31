'use strict'

const test = require('tape')
const sinon = require('sinon')
const { stubBackground } = require('../mocks/pipelines')

test('UNIT => background => initDbs => initializes db with common words', t => {
  t.plan(1)
  try {
    const initDbs = sinon.spy()
    const commonEnglishWords = ['foo', 'bar', 'baz']
    stubBackground({initDbs, commonEnglishWords})
    t.ok(
      initDbs.withArgs(commonEnglishWords).calledOnce,
      'dbs initialized properly'
    )
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('UNIT => background => msg => searchterm: proper pipeline', t => {
  t.plan(9)
  try {
    const msg = {searchterm: 'foo', appId: 'bar'}
    const {
      background,
      maybePropToCtx,
      populateSuggestion,
      populateActiveTab,
      sendToTab
    } = stubBackground({})
    background.sendMessage(msg)
    t.ok(
      maybePropToCtx.calledWith('appId', msg, {}),
      'maybePropToCtx called with appId, msg and ctx'
    )
    t.ok(
      maybePropToCtx.calledWith('searchterm', msg, {}),
      'maybePropToCtx called with searchterm, msg and ctx'
    )
    t.ok(
      populateSuggestion.calledWith({}),
      'populateSuggestion called with ctx'
    )
    t.ok(
      populateActiveTab.calledWith({}),
      'populateActiveTab called with ctx'
    )
    t.ok(
      sendToTab.calledOnce,
      'populateActiveTab called with ctx'
    )
    t.ok(
      populateSuggestion.calledAfter(maybePropToCtx),
      'populateSuggestion called after props verified and placed in ctx'
    )
    t.ok(
      populateActiveTab.calledAfter(maybePropToCtx),
      'populateActiveTab called after props verified and placed in ctx'
    )
    t.ok(
      sendToTab.calledAfter(populateSuggestion),
      'sendToTab called after suggestion were found and placed in ctx'
    )
    t.ok(
      sendToTab.calledAfter(populateActiveTab),
      'sendToTab called after active tab was found and placed in ctx'
    )
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})

test('UNIT => background => msg => newWord: proper pipeline', t => {
  t.plan(7)
  try {
    const msg = {newWord: 'foo'}
    const {
      background,
      maybePropToCtx,
      trimNewWord,
      calcWordScore,
      writeWordToUserDb
    } = stubBackground({})
    background.sendMessage(msg)
    t.ok(
      maybePropToCtx.calledWith('newWord', msg, {}),
      'maybePropToCtx called with searchterm, msg and ctx'
    )
    t.ok(
      trimNewWord.calledWith({}),
      'trimNewWord called with ctx'
    )
    t.ok(
      calcWordScore.calledWith({}),
      'calcWordScore called with ctx'
    )
    t.ok(
      writeWordToUserDb.calledWith({}),
      'writeWordToUserDb called with ctx'
    )
    t.ok(
      trimNewWord.calledAfter(maybePropToCtx),
      'trimNewWord called after newWord was verified and placed in ctx'
    )
    t.ok(
      calcWordScore.calledAfter(trimNewWord),
      'calcWordScore called after word formatted'
    )
    t.ok(
      writeWordToUserDb.calledAfter(calcWordScore),
      'word written to db only after its score was calculated'
    )
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})
