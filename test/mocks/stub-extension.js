window.browser = {
  runtime: {
    onMessage: {
      addListener: function () {} // TODO
    },
    sendMessage: function (msg) {
      // console.log('sending message from runtime', msg)
      window.cust(msg)
    } // TODO - should trigger runtime.onMessage, but only
  },
  tabs: {
    sendMessage: function () {}, // TODO
    query: function () {} // TODO
  },
  windows:{
    WINDOW_ID_CURRENT: 'foo' // TODO
  }
}
