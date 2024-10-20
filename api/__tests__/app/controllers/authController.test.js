// import test from 'ava'
// import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'
// import sinon from 'sinon'

// import config from '#config'
// import Roles from '#constants/roles.js'
// import { login, logout, register, validateToken } from '#controllers/authController.js'
// import { registerSchema } from '#schemas/users.js'
// import * as blacklistCache from '#services/blacklistCache.js'
// import * as usersService from '#services/usersService.js'

// test.beforeEach(t => {
//   t.context.req = {
//     body: {},
//     headers: {},
//     query: {},
//   }
//   t.context.res = {
//     status: sinon.stub().returnsThis(),
//     json: sinon.stub(),
//   }
//   t.context.sandbox = sinon.createSandbox()
// })

// test.afterEach.always(t => {
//   t.context.sandbox.restore()
// })

// test('login - successful', async t => {
//   const { req, res, sandbox } = t.context
//   req.body = { email: 'test@example.com', password: 'password123' }

//   const fakeUser = {
//     id: '123',
//     email: 'test@example.com',
//     password: await bcrypt.hash('password123', 10),
//     role: 'user',
//     displayName: 'Test User',
//   }

//   sandbox.stub(usersService, 'getUserByEmail').resolves(fakeUser)
//   sandbox.stub(jwt, 'sign').returns('fake-token')

//   await login(req, res)

//   t.true(res.json.calledOnce)
//   t.deepEqual(res.json.firstCall.args[0], {
//     token: 'fake-token',
//     user: {
//       id: '123',
//       email: 'test@example.com',
//       displayName: 'Test User',
//       role: 'user',
//     },
//   })
// })

// test('login - user not found', async t => {
//   const { req, res, sandbox } = t.context
//   req.body = { email: 'nonexistent@example.com', password: 'password123' }

//   sandbox.stub(usersService, 'getUserByEmail').resolves(null)

//   await login(req, res)

//   t.true(res.status.calledWith(404))
//   t.true(res.json.calledWith({ message: 'User not found' }))
// })

// test('logout - successful', async t => {
//   const { req, res, sandbox } = t.context
//   req.headers.authorization = 'Bearer fake-token'

//   sandbox.stub(blacklistCache, 'blacklist')

//   await logout(req, res)

//   t.true(blacklistCache.blacklist.calledWith('fake-token'))
//   t.true(res.status.calledWith(200))
//   t.true(res.json.calledWith({ message: 'Logged out successfully' }))
// })

// test('register - successful', async t => {
//   const { req, res, sandbox } = t.context
//   req.body = {
//     displayName: 'New User',
//     password: 'password123',
//   }
//   req.invitee = {
//     email: 'newuser@example.com',
//     role: Roles.INSTRUCTOR,
//   }

//   sandbox.stub(registerSchema, 'validate').returns({ value: req.body })
//   sandbox.stub(bcrypt, 'hash').resolves('hashed-password')
//   sandbox.stub(usersService, 'createUser').resolves()

//   await register(req, res)

//   t.true(res.status.calledWith(201))
//   t.true(res.json.calledWith({ message: 'User registered successfully' }))
// })

// test('register - student without team ID', async t => {
//   const { req, res, sandbox } = t.context
//   req.body = {
//     displayName: 'New Student',
//     password: 'password123',
//   }
//   req.invitee = {
//     email: 'newstudent@example.com',
//     role: Roles.STUDENT,
//   }

//   sandbox.stub(registerSchema, 'validate').returns({ value: req.body })

//   await register(req, res)

//   t.true(res.status.calledWith(400))
//   t.true(res.json.calledWith({ message: 'Team ID is required for student registration' }))
// })

// test('validateToken - valid token', async t => {
//   const { req, res, sandbox } = t.context
//   req.query = { token: 'valid-token', type: 'auth' }

//   sandbox.stub(jwt, 'verify').returns({ id: '123', role: 'user' })

//   await validateToken(req, res)

//   t.true(
//     res.json.calledWith({
//       valid: true,
//       decoded: { id: '123', role: 'user' },
//     }),
//   )
// })

// test('validateToken - invalid token', async t => {
//   const { req, res, sandbox } = t.context
//   req.query = { token: 'invalid-token', type: 'auth' }

//   sandbox.stub(jwt, 'verify').throws(new Error('Invalid token'))

//   await validateToken(req, res)

//   t.true(
//     res.json.calledWith({
//       valid: false,
//       error: 'Invalid or expired token',
//     }),
//   )
// })
