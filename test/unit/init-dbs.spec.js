const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

function getStubbedInitDbs ({commonWordsDb}) {
  return proxyquire('../../js/features/init-dbs', {
    '../dbs/common': commonWordsDb
  })
}

test(
  'UNIT => initDbs(commonEnglishWords) => inserts words into db', t => {
    t.plan(1)
    try {
      const commonEnglishWords = [
        'not',
        'so',
        'common'
      ]
      const commonWordsDb = {
        bulkDocs: sinon.stub().returns(Promise.resolve())
      }
      const { initDbs } = getStubbedInitDbs({commonWordsDb})
      initDbs(commonEnglishWords)
      t.ok(
        commonWordsDb.bulkDocs.calledWith([
          { _id: 'not', score: 3 },
          { _id: 'so', score: 2 },
          { _id: 'common', score: 1 }
        ]),
        'words properly inserted into db'
      )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)
