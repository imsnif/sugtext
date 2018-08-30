const debounce = require('debounce')

const queue = debounce((store, app, path, value) => {
  window.requestAnimationFrame(() => app.update(store.get()))
}, 50)

module.exports = (store, app) => {
  return (path, value) => {
    store.set(path, value)
    queue(store, app, path, value)
  }
}
