'use strict'

const proxyquire = require('proxyquire').noCallThru()
const sinon = require('sinon')

const { curryN, merge, mergeAll } = require('ramda')
const { Right } = require('monet')

function currySpy (fn) {
  const spy = sinon.spy()
  const curried = curryN(fn.length, (...args) => {
    spy(...args)
    return fn(...args)
  })
  curried.calledWith = (...args) => spy.calledWith(...args)
  curried.calledBefore = (...args) => spy.calledBefore(...args)
  curried.calledAfter = (...args) => spy.calledAfter(...args)
  Object.defineProperty(curried, 'callIds', {
    get: () => spy.callIds
  })
  Object.defineProperty(curried, 'called', {
    get: () => spy.called
  })
  curried.args = spy.args
  Object.defineProperty(curried, 'notCalled', {
    get: () => spy.notCalled
  })
  return curried
}

module.exports = {
  mockStore ({visibility, searchterm, suggestions}) {
    const store = {
      get: sinon.stub(),
      set: sinon.stub()
    }
    store.get.withArgs('visibility').returns(visibility)
    store.get.withArgs('searchterm').returns(searchterm)
    store.get.withArgs('suggestions').returns(suggestions)
    return store
  },
  mockEvent ({key, altKey, ctrlKey, metaKey}) {
    return {
      key,
      altKey,
      ctrlKey,
      metaKey,
      target: 'bar'
    }
  },
  getStubbedListeners () {
    const transforms = {
      getWindowSelection: sinon.spy(ctx => Right(ctx)),
      getCurrentCursorPos: currySpy((e, ctx) => Right(ctx)),
      getWindowScroll: currySpy((el, ctx) => Right(ctx)),
      getCursorOffset: currySpy((e, ctx) => Right(ctx)),
      getCurrentText: currySpy((el, ctx) => Right(ctx)),
      dispatchPosition: currySpy((app, ctx) => Right(ctx)),
      dispatchSearchterm: currySpy((app, ctx) => Right(ctx)),
      sendSearchtermToBackground: currySpy((appId, ctx) => Right(ctx)),
      getStoreKeyValue: currySpy((store, key, ctx) => Right(merge(ctx, {[key]: store.get(key)}))),
      dispatchAction: currySpy((app, key, val, ctx) => Right(ctx)),
      updateTextNode: currySpy((el, ctx) => Right(ctx)),
      focusEventTarget: currySpy((e, ctx) => Right(ctx)),
      sendAcceptedToBackground: currySpy((appId, ctx) => Right(ctx)),
      sendNewWordToBackground: currySpy((appId, ctx) => Right(ctx))
    }
    const formatters = {
      findSearchterm: currySpy((lastChar, ctx) => ctx),
      findTextToInsert: sinon.spy(ctx => ctx)
    }
    const listeners = proxyquire('../../js/listeners', {
      './pipeline/transforms': transforms,
      './pipeline/formatters': formatters
    })
    return mergeAll([{listeners}, transforms, formatters])
  },
  stubApi ({app, store, el}) {
    const transforms = {
      getStoreKeyValue: currySpy((store, key, ctx) => Right(merge(ctx, {[key]: store.get(key)}))),
      getClientSize: sinon.spy(ctx => Right(ctx)),
      getAppSize: currySpy((app, ctx) => Right(ctx)),
      updateState: currySpy((app, store, type, val, ctx) => Right(ctx)),
      updateStateFromCtx: currySpy((app, store, ctxKey, key, ctx) => Right(ctx))
    }
    const formatters = {
      calcBoxHorizontalInverse: currySpy((off, ctx) => ctx),
      calcBoxVerticalInverse: currySpy((off, ctx) => ctx),
      calcBoxPos: currySpy((off, ctx) => ctx),
      formatSuggestions: currySpy((suggestions, ctx) => ctx),
      findNewSelectedSuggestions: currySpy((direction, ctx) => ctx)
    }
    const listeners = {
      onKeyDown: sinon.spy(),
      onBlur: sinon.spy(),
      onKeypress: sinon.spy(),
      onMsgFromBackground: sinon.spy()
    }
    const listen = sinon.spy()
    const dispatch = {listen}
    const observe = sinon.stub()
    const observeBackground = sinon.spy()
    if (el) observe.callsArgWith(1, el)
    const api = proxyquire('../../js/api', {
      './pipeline/transforms': transforms,
      './pipeline/formatters': formatters,
      './util/dispatch': dispatch,
      '@redom/store': function () { return store },
      './util/msg-bus': {observeBackground},
      './listeners': () => listeners,
      './util/observe-dom': observe
    })
    api(app)
    const methods = listen.firstCall.args[1]
    return mergeAll([transforms, formatters, methods, listeners, {observe, observeBackground}])
  },
  mockDomElement () {
    return {
      addEventListener: sinon.spy()
    }
  }
}
