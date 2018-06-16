const { dispatch } = require('./dispatch')
const { position, offset } = require('caret-pos')
const { sendToBackground } = require('./msg-bus')

module.exports = (store, app) => {
  return {
    onKeyDown (e) {
      // TODO: cleanup
      if (e.key === 'Tab') {
        if (store.get('visibility') !== 'visible') return
        const { pos } = position(this)
        const searchterm = store.get('searchterm')
        const suggestions = store.get('suggestions')
        const wordStartPosition = searchterm ? pos - searchterm.length : pos
        const textBeforeSearchterm = this.textContent.slice(0, wordStartPosition)
        const textAfterSearchterm = this.textContent.slice(wordStartPosition + searchterm.length)
        const contentWithCompletedWord = `${textBeforeSearchterm}${suggestions[0]}`
        const fullContent = `${contentWithCompletedWord}${textAfterSearchterm}`
        this.textContent = fullContent
        const range = document.createRange()
        const sel = window.getSelection()
        range.setStart(this.firstChild, contentWithCompletedWord.length)
        sel.removeAllRanges()
        sel.addRange(range)
        e.preventDefault()
        this.focus()
        dispatch(app, 'visibility', 'hidden')
      }
    },
    onBlur (e) {
      dispatch(app, 'visibility', 'hidden')
    },
    onKeypress (e) {
      if (/^[a-z0-9]$/i.test(e.key)) { // TODO: adjust regex or find a better solution
        const off = offset(this)
        const { pos } = position(this)
        const textUptoCursor = this.textContent.slice(0, pos) + e.key
        const searchterm = textUptoCursor.split(/\s+/).pop()
        dispatch(app, 'position', off)
        dispatch(app, 'search', searchterm)
        sendToBackground({searchterm})
      }
    },
    onMsgFromBackground ({suggestions}) {
      dispatch(app, 'visibility', 'visible')
      dispatch(app, 'suggest', suggestions)
    }
  }
}
