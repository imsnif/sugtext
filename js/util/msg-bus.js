/* globals browser */

module.exports = {
  sendToBackground: browser.runtime.sendMessage,
  observeBackground: browser.runtime.onMessage.addListener
}
