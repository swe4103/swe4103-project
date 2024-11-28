import test from 'ava'
import sinon from 'sinon'
import request from 'supertest'

import { setupRouteTest } from '#__tests__/helpers/setupRouteTest.js'

const createUserStubs = () => ({
  inviteUsers: sinon
    .stub()
    .callsFake((req, res) => res.status(201).json({ message: 'Users invited' })),
  getUser: sinon
    .stub()
    .callsFake((req, res) => res.status(200).json({ id: req.params.id, name: 'John Doe' })),
  updateUser: sinon
    .stub()
    .callsFake((req, res) => res.status(200).json({ id: req.params.id, name: req.body.name })),
  deleteUser: sinon.stub().callsFake((req, res) => res.status(204).send()),
})

test('POST /api/users/invite requires authentication and authorization', async t => {
  const controllerStubs = createUserStubs()
  const { app, auth, roles } = await setupRouteTest({
    routePath: '#routes/users.js',
    controllerPath: '#controllers/usersController.js',
    basePath: 'users',
    controllerStubs,
  })

  auth.callsFake((req, res) => res.status(401).json({ message: 'Unauthorized' }))

  const response = await request(app)
    .post('/api/users/invite')
    .send({ emails: ['user1@example.com'] })

  t.is(response.status, 401)
  t.deepEqual(response.body, { message: 'Unauthorized' })
})

test('POST /api/users/invite invites users when authorized', async t => {
  const controllerStubs = createUserStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/users.js',
    controllerPath: '#controllers/usersController.js',
    basePath: 'users',
    controllerStubs,
  })

  const response = await request(app)
    .post('/api/users/invite')
    .send({
      emails: ['user1@example.com', 'user2@example.com'],
    })

  t.is(response.status, 201)
  t.deepEqual(response.body, { message: 'Users invited' })
  t.true(stubs.inviteUsers.calledOnce)
})

test('GET /api/users/:id fetches user details', async t => {
  const controllerStubs = createUserStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/users.js',
    controllerPath: '#controllers/usersController.js',
    basePath: 'users',
    controllerStubs,
  })

  const response = await request(app).get('/api/users/user-123')

  t.is(response.status, 200)
  t.deepEqual(response.body, { id: 'user-123', name: 'John Doe' })
  t.true(stubs.getUser.calledOnce)
  t.is(stubs.getUser.firstCall.args[0].params.id, 'user-123')
})

test('PUT /api/users/:id updates a user', async t => {
  const controllerStubs = createUserStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/users.js',
    controllerPath: '#controllers/usersController.js',
    basePath: 'users',
    controllerStubs,
  })

  const response = await request(app).put('/api/users/user-123').send({ name: 'Updated Name' })

  t.is(response.status, 200)
  t.deepEqual(response.body, { id: 'user-123', name: 'Updated Name' })
  t.true(stubs.updateUser.calledOnce)
  t.is(stubs.updateUser.firstCall.args[0].params.id, 'user-123')
  t.is(stubs.updateUser.firstCall.args[0].body.name, 'Updated Name')
})

test('DELETE /api/users/:id deletes a user', async t => {
  const controllerStubs = createUserStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/users.js',
    controllerPath: '#controllers/usersController.js',
    basePath: 'users',
    controllerStubs,
  })

  const response = await request(app).delete('/api/users/user-123')

  t.is(response.status, 204)
  t.true(stubs.deleteUser.calledOnce)
  t.is(stubs.deleteUser.firstCall.args[0].params.id, 'user-123')
})

test('GET /api/users/:id returns 404 for non-existent user', async t => {
  const controllerStubs = createUserStubs()
  controllerStubs.getUser.callsFake((req, res) =>
    res.status(404).json({ message: 'User not found' }),
  )

  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/users.js',
    controllerPath: '#controllers/usersController.js',
    basePath: 'users',
    controllerStubs,
  })

  const response = await request(app).get('/api/users/nonexistent')

  t.is(response.status, 404)
  t.deepEqual(response.body, { message: 'User not found' })
  t.true(stubs.getUser.calledOnce)
})
