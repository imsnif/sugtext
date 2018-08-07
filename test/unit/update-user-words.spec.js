const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

function getStubbedUpdateWords ({userWordsDb = {}}) {
  return proxyquire('../../js/features/update-user-words', {
    '../dbs/user': userWordsDb
  })
}

test(
  'UNIT => trimNewWord({newWord}) => properly formats inputted word', t => {
    t.plan(1)
    try {
      const newWord = 'foobar!!,,?..?'
      const { trimNewWord } = getStubbedUpdateWords({})
      t.deepEquals(
        trimNewWord({newWord}),
        {_id: 'foobar'},
        'new word formatted properly'
      )
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => calcWordScore(wordEntry) => calc score for existing word', t => {
    t.plan(1)
    try {
      const wordEntry = {_id: 'foo', score: 12}
      const userWordsDb = {
        get: sinon.stub().withArgs(wordEntry._id).returns(Promise.resolve(wordEntry))
      }
      const { calcWordScore } = getStubbedUpdateWords({userWordsDb})
      calcWordScore(wordEntry).fork(t.fail, entry => t.deepEquals(entry,
        {_id: 'foo', score: 13},
        'new score calculated properly'
      ))
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => calcWordScore(wordEntry) => calc score for new word', t => {
    t.plan(1)
    try {
      const wordEntry = {_id: 'foo', score: 12}
      const userWordsDb = {
        get: sinon.stub().withArgs(wordEntry._id).returns(
          Promise.reject(new Error('no such word'))
        )
      }
      const { calcWordScore } = getStubbedUpdateWords({userWordsDb})
      calcWordScore(wordEntry).fork(t.fail, entry => t.deepEquals(entry,
        {_id: 'foo', score: 1},
        'new score calculated properly'
      ))
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => writeWordToUserDb(wordEntry) => writes word to db', t => {
    t.plan(1)
    try {
      const wordEntry = {_id: 'foo', score: 12}
      const userWordsDb = {
        put: sinon.stub().withArgs(wordEntry).returns(Promise.resolve())
      }
      const { writeWordToUserDb } = getStubbedUpdateWords({userWordsDb})
      writeWordToUserDb(wordEntry).fork(t.fail, () => {
        t.ok(userWordsDb.put.calledWith(wordEntry))
      })
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)
