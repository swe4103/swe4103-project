import test from 'ava'
import sinon from 'sinon'
import request from 'supertest'

import { setupRouteTest } from '#__tests__/helpers/setupRouteTest.js'

const createAuthStubs = () => ({
  login: sinon.stub().callsFake((req, res) => res.status(200).json({ token: 'fake-token' })),
  logout: sinon.stub().callsFake((req, res) => res.status(200).json({ message: 'Logged out' })),
  register: sinon
    .stub()
    .callsFake((req, res) => res.status(201).json({ user: { id: 'user-123' } })),
  validateToken: sinon.stub().callsFake((req, res) => res.status(200).json({ valid: true })),
})

test('POST /api/auth/login logs in the user', async t => {
  const controllerStubs = createAuthStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/auth.js',
    controllerPath: '#controllers/authController.js',
    basePath: 'auth',
    controllerStubs,
  })

  const response = await request(app).post('/api/auth/login').send({
    username: 'testuser',
    password: 'testpassword',
  })

  t.is(response.status, 200)
  t.deepEqual(response.body, { token: 'fake-token' })
  t.true(stubs.login.calledOnce)
})

test('POST /api/auth/logout logs out the user', async t => {
  const controllerStubs = createAuthStubs()
  const { app, stubs, auth } = await setupRouteTest({
    routePath: '#routes/auth.js',
    controllerPath: '#controllers/authController.js',
    basePath: 'auth',
    controllerStubs,
  })

  auth.callsFake((req, res, next) => next())

  const response = await request(app).post('/api/auth/logout')

  t.is(response.status, 200)
  t.deepEqual(response.body, { message: 'Logged out' })
  t.true(stubs.logout.calledOnce)
})

test('POST /api/auth/register registers a new user', async t => {
  const controllerStubs = createAuthStubs()
  const { app, stubs, auth } = await setupRouteTest({
    routePath: '#routes/auth.js',
    controllerPath: '#controllers/authController.js',
    basePath: 'auth',
    controllerStubs,
  })

  auth.callsFake((req, res, next) => next())

  const response = await request(app).post('/api/auth/register').send({
    displayName: 'Test',
    password: 'password123',
  })

  t.is(response.status, 201)
  t.deepEqual(response.body, { user: { id: 'user-123' } })
  t.true(stubs.register.calledOnce)
})

test('GET /api/auth/validate-token validates a token', async t => {
  const controllerStubs = createAuthStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/auth.js',
    controllerPath: '#controllers/authController.js',
    basePath: 'auth',
    controllerStubs,
  })

  const response = await request(app).get('/api/auth/validate-token')

  t.is(response.status, 200)
  t.deepEqual(response.body, { valid: true })
  t.true(stubs.validateToken.calledOnce)
})
