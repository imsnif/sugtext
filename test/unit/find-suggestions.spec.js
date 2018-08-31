const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

function getStubbedPopulateSugg ({dbs}) {
  return proxyquire('../../js/features/find-suggestion', {
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
  'UNIT => populateSuggestion(ctx) => returns and formats suggestion', t => {
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
      const { populateSuggestion } = getStubbedPopulateSugg({dbs})
      populateSuggestion(ctx).fork(t.fail, suggestion => {
        t.deepEquals(
          suggestion,
          { suggestion: 'foobarbaz2' },
          'suggestion properly returned and sorted'
        )
      })
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)
