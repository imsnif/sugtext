/* global browser */

'use strict'

const Future = require('fluture')
const R = require('ramda')

module.exports = {
  sendToTab (suggestion, tabId, appId, searchterm) {
    if (!suggestion) return Future.of()
    return Future.try(() => browser.tabs.sendMessage(tabId, {appId, suggestion, searchterm}))
  },
  populateActiveTab () {
    return Future
      .tryP(() => browser.tabs.query({active: true, currentWindow: true}))
      .map(tabs => tabs[0].id)
      .map(R.objOf('tabId'))
  }
}
