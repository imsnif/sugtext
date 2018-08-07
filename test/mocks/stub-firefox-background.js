window.browser = {
  listeners: [],
  runtime: {
    onMessage: {
      addListener: function (func) {
        window.browser.listeners.push(func)
      }
    }
  },
  tabs: {
    sendMessage: function (...msg) {
      window.sendToContentPage(...msg)
    },
    query: function () {
      return Promise.resolve([{id: 1}])
    }
  },
  windows: {
    WINDOW_ID_CURRENT: 'foo'
  }
}
