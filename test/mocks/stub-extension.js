window.browser = {
  runtime: {
    onMessage: {
      addListener: function () {} // TODO
    },
    sendMessage: function (msg) {
      window.cust(msg)
    }
  },
  tabs: {
    sendMessage: function () {}, // TODO
    query: function () {} // TODO
  },
  windows: {
    WINDOW_ID_CURRENT: 'foo' // TODO
  }
}
