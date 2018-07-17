'use strict'

const commonEnglishWords = require('../common-words.json')
const PouchDB = require('pouchdb')
const db = new PouchDB('words')

function initDb () {
  // TODO: clear db?
  const wordDocs = commonEnglishWords.map((w, i) => {
    return {_id: w, score: commonEnglishWords.length - i}
  })
  return db.bulkDocs(wordDocs)
}
initDb()

browser.runtime.onMessage.addListener(generateSuggestions)

async function generateSuggestions (message) {
  const {searchterm} = message
  // TODO: unique id from instance rather than active tab with nested iframes
  const tabs = await browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT})
  const tabId = tabs[0].id
  const suggestions = searchterm && searchterm.length > 1
    ? await findWords(searchterm)
    : []
  if (suggestions.length > 0) {
    browser.tabs.sendMessage(tabId, {suggestions})
  }
}

async function findWords (searchterm) {
  const matches = await db.allDocs({
    startkey: searchterm,
    endkey: `${searchterm}\uffff`,
    include_docs: true
  })
  return matches.rows
  .filter(m => m.id.length >= (searchterm.length + 2))
  .sort((a, b) => a.doc.score < b.doc.score)
  .slice(0, 5).map(m => m.id)
}
