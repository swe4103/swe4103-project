import test from 'ava'
import sinon from 'sinon'

import { authorizeRoles } from '#middleware/roleMiddleware.js'

test.beforeEach(t => {
  const statusStub = sinon.stub()
  const jsonStub = sinon.stub()
  statusStub.returns({ json: jsonStub })

  t.context = {
    req: {},
    res: {
      status: statusStub,
      json: jsonStub,
    },
    next: sinon.stub(),
  }
})

test.afterEach(() => {
  sinon.restore()
})

test('returns 401 when no user is present in request', t => {
  const { req, res, next } = t.context
  const middleware = authorizeRoles('admin')

  middleware(req, res, next)

  t.true(res.status.calledWith(401))
  t.true(res.json.calledWith({ message: 'Unauthorized: No user found' }))
  t.false(next.called)
})

test('returns 403 when user role is not in allowed roles', t => {
  const { req, res, next } = t.context
  const middleware = authorizeRoles('admin')
  req.user = { role: 'user' }

  middleware(req, res, next)

  t.true(res.status.calledWith(403))
  t.true(res.json.calledWith({ message: 'Forbidden: Access denied' }))
  t.false(next.called)
})

test('calls next when user role is in allowed roles', t => {
  const { req, res, next } = t.context
  const middleware = authorizeRoles('admin', 'superuser')
  req.user = { role: 'admin' }

  middleware(req, res, next)

  t.false(res.status.called)
  t.false(res.json.called)
  t.true(next.calledOnce)
})

test('handles multiple allowed roles correctly', t => {
  const { req, res, next } = t.context
  const middleware = authorizeRoles('admin', 'moderator', 'supervisor')
  req.user = { role: 'moderator' }

  middleware(req, res, next)

  t.false(res.status.called)
  t.false(res.json.called)
  t.true(next.calledOnce)
})

test('correctly denies access for role casing differences', t => {
  const { req, res, next } = t.context
  const middleware = authorizeRoles('Admin')
  req.user = { role: 'admin' }

  middleware(req, res, next)

  t.true(res.status.calledWith(403))
  t.true(res.json.calledWith({ message: 'Forbidden: Access denied' }))
  t.false(next.called)
})
