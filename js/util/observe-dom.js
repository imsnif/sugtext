/* globals MutationObserver */

module.exports = (selector, cb) => {
  const seen = new Map()
  const observer = new MutationObserver(function (mutation) {
    const matchingElements = document.querySelectorAll(selector)
    Array.from(matchingElements)
      .filter(el => !seen.has(el))
      .forEach(el => {
        cb(el)
        seen.set(el, 1) // TODO: what happens when these are destroyed?
      })
  })
  const doc = document.documentElement || document.body // TODO: ??
  const observationConfig = { childList: true, subtree: true }
  observer.observe(doc, observationConfig)
}
