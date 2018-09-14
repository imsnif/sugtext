'use strict'

const Future = require('fluture')
const { Identity } = require('monet')

const commonWordsDb = require('../dbs/common')
const userWordsDb = require('../dbs/user')

const noop = () => {}

const setInitScores = words => words.map(
  (w, i) => ({_id: w, score: words.length - i})
)

module.exports = {
  initDbs (commonEnglishWords) {
    Identity(commonEnglishWords)
      .map(setInitScores)
      .chain(entries => Future.tryP(() => commonWordsDb.bulkDocs(entries)))
      .chain(() => Future.tryP(() => {
        // TODO: move this to userWordsDb - preferably just delete the db
        // and recreate it rather than doing this clunky thing
        return userWordsDb.allDocs()
          .then(result => {
            return Promise.all(
              result.rows.map(row => {
                return userWordsDb.remove(row.id, row.value.rev)
              })
            )
          })
      }))
      .fork(console.error, noop)
  }
}
