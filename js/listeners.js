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
        const textWithoutSearchterm = this.textContent.slice(0, wordStartPosition)
        const contentWithCompletedWord = `${textWithoutSearchterm}${suggestions[0]}`
        this.textContent = contentWithCompletedWord
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
        const fullText = this.textContent + e.key
        const searchterm = fullText.split(/\s+/).pop() // TODO: get cursor position and work back from it
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
