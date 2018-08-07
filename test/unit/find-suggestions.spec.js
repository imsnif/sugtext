const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

function getStubbedPopulateSugg ({dbs}) {
  return proxyquire('../../js/features/find-suggestions', {
    '../dbs/common': dbs.common,
    '../dbs/user': dbs.user
  })
}

const commonWordResults = {
  rows: [
    {id: 'foobar', doc: {score: 1}},
    {id: 'foobar1', doc: {score: 1}},
    {id: 'foobar2', doc: {score: 2}},
    {id: 'foobar3', doc: {score: 3}},
    {id: 'foobar4', doc: {score: 4}},
    {id: 'foobar5', doc: {score: 5}}
  ]
}

const userWordResults = {
  rows: [
    {id: 'foobarbaz', doc: {score: 1}},
    {id: 'foobarbaz1', doc: {score: 1}},
    {id: 'foobarbaz2', doc: {score: 2}}
  ]
}

test(
  'UNIT => populateSuggestions(ctx) => returns and formats suggestions', t => {
    t.plan(1)
    try {
      const ctx = {searchterm: 'foo'}
      const dbs = {
        common: {
          allDocs: sinon.stub().returns(Promise.resolve(commonWordResults))
        },
        user: {
          allDocs: sinon.stub().returns(Promise.resolve(userWordResults))
        }
      }
      const { populateSuggestions } = getStubbedPopulateSugg({dbs})
      populateSuggestions(ctx).fork(t.fail, suggestions => {
        t.deepEquals(suggestions,
          {
            suggestions: [
              'foobarbaz2',
              'foobarbaz1',
              'foobarbaz',
              'foobar5',
              'foobar4'
            ]
          },
          'suggestions properly returned and sorted'
        )
      })
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)
