import test from 'ava'
import esmock from 'esmock'
import sinon from 'sinon'

test.beforeEach(async t => {
  const statusStub = sinon.stub()
  const jsonStub = sinon.stub()
  statusStub.returns({ json: jsonStub })

  t.context = {
    req: {
      headers: {},
      query: {},
    },
    res: {
      status: statusStub,
      json: jsonStub,
    },
    next: sinon.stub(),
    verifyStub: sinon.stub(),
  }

  // Set up the JWT verify stub with default behavior
  t.context.verifyStub.callsFake((token, secret, callback) => {
    callback(null, { id: 1 })
  })

  // Mock both blacklistCache and jsonwebtoken
  const { authJWT, inviteJWT } = await esmock('#middleware/authMiddleware.js', {
    '#services/blacklistCache.js': {
      isBlacklisted: sinon.stub().returns(false),
    },
    'jsonwebtoken': {
      verify: t.context.verifyStub,
    },
  })

  t.context.authJWT = authJWT
  t.context.inviteJWT = inviteJWT
})

test.afterEach(() => {
  sinon.restore()
})

test('authJWT returns 401 when authorization header is missing', t => {
  const { req, res, next, authJWT } = t.context

  authJWT(req, res, next)

  t.true(res.status.calledWith(401))
  t.true(res.json.calledWith({ message: 'Authorization header missing' }))
  t.false(next.called)
})

test('authJWT returns 401 when token is blacklisted', async t => {
  const { req, res, next } = t.context
  const token = 'blacklisted.token.here'
  req.headers.authorization = `Bearer ${token}`

  const { authJWT } = await esmock('#middleware/authMiddleware.js', {
    '#services/blacklistCache.js': {
      isBlacklisted: sinon.stub().returns(true),
    },
    'jsonwebtoken': {
      verify: t.context.verifyStub,
    },
  })

  authJWT(req, res, next)

  t.true(res.status.calledWith(401))
  t.true(res.json.calledWith({ message: 'Token is blacklisted' }))
  t.false(next.called)
})

test('authJWT returns 403 when token is invalid', async t => {
  const { req, res, next, verifyStub } = t.context
  const token = 'invalid.token.here'
  req.headers.authorization = `Bearer ${token}`

  verifyStub.callsFake((token, secret, callback) => {
    callback(new Error('Invalid token'))
  })

  const { authJWT } = await esmock('#middleware/authMiddleware.js', {
    '#services/blacklistCache.js': {
      isBlacklisted: sinon.stub().returns(false),
    },
    'jsonwebtoken': {
      verify: verifyStub,
    },
  })

  authJWT(req, res, next)

  t.true(res.status.calledWith(403))
  t.true(res.json.calledWith({ message: 'Invalid token' }))
  t.false(next.called)
})

test('authJWT sets user and calls next for valid token', async t => {
  const { req, res, next, verifyStub } = t.context
  const token = 'valid.token.here'
  const user = { id: 1, email: 'test@example.com' }
  req.headers.authorization = `Bearer ${token}`

  verifyStub.callsFake((token, secret, callback) => {
    callback(null, user)
  })

  const { authJWT } = await esmock('#middleware/authMiddleware.js', {
    '#services/blacklistCache.js': {
      isBlacklisted: sinon.stub().returns(false),
    },
    'jsonwebtoken': {
      verify: verifyStub,
    },
  })

  authJWT(req, res, next)

  t.deepEqual(req.user, user)
  t.true(next.calledOnce)
})

test('inviteJWT returns 401 when token is missing', t => {
  const { req, res, next, inviteJWT } = t.context

  inviteJWT(req, res, next)

  t.true(res.status.calledWith(401))
  t.true(res.json.calledWith({ message: 'Invite token missing' }))
  t.false(next.called)
})

test('inviteJWT returns 401 when token is blacklisted', async t => {
  const { req, res, next, verifyStub } = t.context
  req.query.token = 'blacklisted.token.here'

  const { inviteJWT } = await esmock('#middleware/authMiddleware.js', {
    '#services/blacklistCache.js': {
      isBlacklisted: sinon.stub().returns(true),
    },
    'jsonwebtoken': {
      verify: verifyStub,
    },
  })

  inviteJWT(req, res, next)

  t.true(res.status.calledWith(401))
  t.true(res.json.calledWith('Invite token is blacklisted'))
  t.false(next.called)
})

test('inviteJWT returns 403 when token is invalid', async t => {
  const { req, res, next, verifyStub } = t.context
  req.query.token = 'invalid.token.here'

  verifyStub.callsFake((token, secret, callback) => {
    callback(new Error('Invalid token'))
  })

  const { inviteJWT } = await esmock('#middleware/authMiddleware.js', {
    '#services/blacklistCache.js': {
      isBlacklisted: sinon.stub().returns(false),
    },
    'jsonwebtoken': {
      verify: verifyStub,
    },
  })

  inviteJWT(req, res, next)

  t.true(res.status.calledWith(403))
  t.true(res.json.calledWith({ message: 'Invalid token' }))
  t.false(next.called)
})

test('inviteJWT sets invitee and calls next for valid token', async t => {
  const { req, res, next, verifyStub } = t.context
  const token = 'valid.token.here'
  const invitee = { email: 'invited@example.com', role: 'user' }
  req.query.token = token

  verifyStub.callsFake((token, secret, callback) => {
    callback(null, invitee)
  })

  const { inviteJWT } = await esmock('#middleware/authMiddleware.js', {
    '#services/blacklistCache.js': {
      isBlacklisted: sinon.stub().returns(false),
    },
    'jsonwebtoken': {
      verify: verifyStub,
    },
  })

  inviteJWT(req, res, next)

  t.deepEqual(req.invitee, invitee)
  t.true(next.calledOnce)
})
