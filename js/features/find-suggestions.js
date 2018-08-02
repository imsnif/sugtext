'use strict'

const Future = require('fluture')
const R = require('ramda')
const { Identity } = require('monet')

const commonWordsDb = require('../dbs/common')
const userWordsDb = require('../dbs/user')

const dbPriority = [userWordsDb, commonWordsDb]

const buildQuery = searchterm => ({
  startkey: searchterm,
  endkey: `${searchterm}\uffff`,
  include_docs: true
})

const formatResults = searchterm => R.compose(
  R.map(R.prop('id')),
  R.slice(0, 5),
  R.reverse,
  R.sortBy(R.path(['doc', 'score'])),
  R.filter(m => m.id.length >= (searchterm.length + 2)),
  R.prop('rows')
)

const queryForWords = (db, searchterm) => {
  return Identity(buildQuery(searchterm))
    .chain(query => Future.tryP(() => db.allDocs(query)))
    .map(formatResults(searchterm))
}

module.exports = {
  populateSuggestions (ctx) {
    return Future.parallel(
      dbPriority.length,
      dbPriority.map(db => queryForWords(db, ctx.searchterm))
    )
      .map(R.compose(R.slice(0, 5), R.uniq, R.flatten))
      .map(R.objOf('suggestions'))
  }
}
