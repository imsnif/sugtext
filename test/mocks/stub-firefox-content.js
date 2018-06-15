window.browser = {
  listeners: [],
  runtime: {
    onMessage: {
      addListener: function (func) {
        window.browser.listeners.push(func)
      }
    },
    sendMessage: function (msg) {
      window.sendToBackgroundPage(msg)
    }
  }
}
