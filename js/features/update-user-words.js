'use strict'

const Future = require('fluture')
const R = require('ramda')

const userWordsDb = require('../dbs/user')

module.exports = {
  trimNewWord: R.compose(
    R.objOf('_id'),
    R.replace(/[,|.|!|?]+$/, ''),
    R.prop('newWord')
  ),
  calcWordScore (wordEntry) {
    return Future.tryP(() => userWordsDb.get(wordEntry._id))
      .fold(
        () => R.merge(wordEntry, {score: 1}),
        existing => R.merge(existing, {score: existing.score + 1})
      )
  },
  writeWordToUserDb (wordEntry) {
    if (wordEntry._id.length === 0) return Future.of({})
    return Future.tryP(() => userWordsDb.put(wordEntry))
  }
}
