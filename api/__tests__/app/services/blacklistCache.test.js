import test from 'ava'
import sinon from 'sinon'

import { setupTest } from '#__tests__/helpers/setupTest.js'

test('blacklist adds token to cache with correct expiration', async t => {
  const mockCache = {
    set: sinon.stub(),
    has: sinon.stub(),
  }

  const { service } = await setupTest('#services/blacklistCache.js', {
    'node-cache': function () {
      return mockCache
    },
  })

  const testToken = 'test-token-123'
  service.blacklist(testToken)

  t.true(mockCache.set.calledOnce)
  t.deepEqual(mockCache.set.firstCall.args, [testToken, true, 86400])
})

test('isBlacklisted returns correct status for blacklisted token', async t => {
  const mockCache = {
    set: sinon.stub(),
    has: sinon.stub().returns(true),
  }

  const { service } = await setupTest('#services/blacklistCache.js', {
    'node-cache': function () {
      return mockCache
    },
  })

  const testToken = 'test-token-123'
  const result = service.isBlacklisted(testToken)

  t.true(mockCache.has.calledOnce)
  t.is(mockCache.has.firstCall.args[0], testToken)
  t.true(result)
})

test('isBlacklisted returns false for non-blacklisted token', async t => {
  const mockCache = {
    set: sinon.stub(),
    has: sinon.stub().returns(false),
  }

  const { service } = await setupTest('#services/blacklistCache.js', {
    'node-cache': function () {
      return mockCache
    },
  })

  const testToken = 'test-token-123'
  const result = service.isBlacklisted(testToken)

  t.true(mockCache.has.calledOnce)
  t.is(mockCache.has.firstCall.args[0], testToken)
  t.false(result)
})
