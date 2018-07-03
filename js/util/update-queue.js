module.exports = (store, app) => {
  return (path, value) => {
    store.set(path, value)
    window.requestAnimationFrame(() => app.update(store.get()))
  }
}
