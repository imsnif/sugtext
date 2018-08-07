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
  'UNIT => sendToTab(suggestions, tabId, appId) => sends message to tab', t => {
    t.plan(2)
    try {
      const suggestions = ['foo']
      const tabId = 42
      const appId = 47
      const sendMessage = sinon.stub().returns('foobar')
      stubBrowser({sendMessage})
      sendToTab(suggestions, tabId, appId)
        .fork(t.fail, ret => {
          t.equals(ret, 'foobar', 'result of sendMessage returned')
          t.ok(
            sendMessage.calledWith(tabId, {appId, suggestions}),
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
  'UNIT => sendToTab(suggestions, tabId, appId) => noop no suggestions', t => {
    t.plan(2)
    try {
      const suggestions = []
      const tabId = 42
      const appId = 47
      const sendMessage = sinon.stub().returns('foobar')
      stubBrowser({sendMessage})
      sendToTab(suggestions, tabId, appId)
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
      .returns(rawTabInfo)
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
