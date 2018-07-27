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
  curried.callIds = spy.callIds
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
  mockEvent ({key}) {
    return {
      key,
      target: 'bar' // TBD
    }
  },
  mockListeners () {
    const transforms = {
      getStoreKeyValue: currySpy((store, key, ctx) => Right(merge(ctx, {[key]: store.get(key)}))),
      dispatchAction: currySpy((app, key, val, ctx) => Right(ctx)),
      updateTextNode: currySpy((el, ctx) => Right(ctx)),
      focusEventTarget: currySpy((e, ctx) => Right(ctx)),
      sendAcceptedToBackground: currySpy((id, ctx) => Right(ctx))
    }
    const formatters = {
      findTextToInsert: sinon.spy(ctx => ctx)
    }
    const listeners = proxyquire('../../js/listeners', {
      './pipeline/transforms': transforms,
      './pipeline/formatters': formatters
    })
    return mergeAll([{listeners}, transforms, formatters])
  }
}
