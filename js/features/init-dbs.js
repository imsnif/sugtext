'use strict'

const Future = require('fluture')
const { Identity } = require('monet')

const commonWordsDb = require('../dbs/common')

const noop = () => {}

const setInitScores = words => words.map(
  (w, i) => ({_id: w, score: words.length - i})
)

module.exports = {
  initDbs (commonEnglishWords) {
    Identity(commonEnglishWords)
      .map(setInitScores)
      .chain(entries => Future.tryP(() => commonWordsDb.bulkDocs(entries)))
      .fork(console.error, noop)
  }
}
