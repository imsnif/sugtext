const dictWords = require('../words.json')

browser.runtime.onMessage.addListener(generateSuggestions)

async function generateSuggestions (message) {
  const {searchterm} = message
  const tabs = await browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT})
  const tabId = tabs[0].id
  const suggestions = searchterm && searchterm.length > 1
    ? findWords(searchterm)
    : []
  if (suggestions.length > 0) {
    browser.tabs.sendMessage(tabId, {suggestions})
  }
}


function findWords (searchterm) {
  // TODO: better algorithm
  let matches = []
  let index = 0
  while (matches.length < 5) {
    const word = dictWords[index]
    if (!word) {
      return matches
    }
    if (word.startsWith(searchterm)) {
      matches.push(word)
    }
    index++
  }
  return matches
}

