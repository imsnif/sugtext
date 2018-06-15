module.exports = (store, app) => {
  let updating
  return (path, value) => {
    store.set(path, value)
    updating || (updating = window.requestAnimationFrame(() => {
      updating = false
      app.update(store.get())
    }))
  }
}
