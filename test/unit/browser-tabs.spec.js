const test = require('tape')
const sinon = require('sinon')

const {
  sendToTab,
  populateActiveTab
} = require('../../js/features/browser-tabs')

function stubBrowser ({sendMessage, query}) {
  global.browser = {
    tabs: {sendMessage, query}
  }
}

test(
  'UNIT => sendToTab(suggestion, tabId, appId, searchterm) => sends message to tab', t => {
    t.plan(2)
    try {
      const suggestion = ['foo']
      const tabId = 42
      const appId = 47
      const searchterm = 'searchterm'
      const sendMessage = sinon.stub().returns('foobar')
      stubBrowser({sendMessage})
      sendToTab(suggestion, tabId, appId, searchterm)
        .fork(t.fail, ret => {
          t.equals(ret, 'foobar', 'result of sendMessage returned')
          t.ok(
            sendMessage.calledWith(tabId, {appId, suggestion, searchterm}),
            'proper data sent'
          )
        })
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test(
  'UNIT => sendToTab(suggestion, tabId, appId) => noop on no suggestion', t => {
    t.plan(2)
    try {
      const suggestion = null
      const tabId = 42
      const appId = 47
      const sendMessage = sinon.stub().returns('foobar')
      stubBrowser({sendMessage})
      sendToTab(suggestion, tabId, appId)
        .fork(t.fail, ret => {
          t.equals(ret, undefined, 'returned undefined')
          t.ok(sendMessage.notCalled, 'no message sent')
        })
    } catch (e) {
      console.error(e.stack)
      t.fail(e)
      t.end()
    }
  }
)

test('UNIT => populateActiveTab() => returns active tab id', t => {
  t.plan(1)
  try {
    const rawTabInfo = [{id: 0}, {id: 1}]
    const query = sinon.stub()
      .withArgs({active: true, currentWindow: true})
      .returns(Promise.resolve(rawTabInfo))
    stubBrowser({query})
    populateActiveTab()
      .fork(t.fail, ret => {
        t.deepEquals(ret, {tabId: 0}, 'proper return and format')
      })
  } catch (e) {
    console.error(e.stack)
    t.fail(e)
    t.end()
  }
})
