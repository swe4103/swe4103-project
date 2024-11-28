import test from 'ava'
import sinon from 'sinon'
import request from 'supertest'

import { setupRouteTest } from '#__tests__/helpers/setupRouteTest.js'

const createJoyStubs = () => ({
  createJoyRating: sinon
    .stub()
    .callsFake((req, res) => res.status(201).json({ id: 'joy-123', rating: 5 })),
  listJoyRatings: sinon.stub().callsFake((req, res) => res.status(200).json([])),
  getJoyRating: sinon
    .stub()
    .callsFake((req, res) => res.status(200).json({ id: req.params.id, rating: 5 })),
  updateJoyRating: sinon
    .stub()
    .callsFake((req, res) => res.status(200).json({ id: req.params.id, rating: 4 })),
  deleteJoyRating: sinon.stub().callsFake((req, res) => res.status(204).send()),
})

test('POST /api/joy requires authentication', async t => {
  const controllerStubs = createJoyStubs()
  const { app, auth } = await setupRouteTest({
    routePath: '#routes/joy.js',
    controllerPath: '#controllers/joyController.js',
    basePath: 'joy',
    controllerStubs,
  })

  auth.callsFake((req, res) => res.status(401).json({ message: 'Unauthorized' }))

  const response = await request(app).post('/api/joy').send({ rating: 5 })

  t.is(response.status, 401)
  t.deepEqual(response.body, { message: 'Unauthorized' })
})

test('POST /api/joy creates joy rating when authorized', async t => {
  const controllerStubs = createJoyStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/joy.js',
    controllerPath: '#controllers/joyController.js',
    basePath: 'joy',
    controllerStubs,
  })

  const response = await request(app).post('/api/joy').send({ rating: 5 })

  t.is(response.status, 201)
  t.deepEqual(response.body, { id: 'joy-123', rating: 5 })
  t.true(stubs.createJoyRating.calledOnce)
})

test('GET /api/joy fetches joy ratings list', async t => {
  const controllerStubs = createJoyStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/joy.js',
    controllerPath: '#controllers/joyController.js',
    basePath: 'joy',
    controllerStubs,
  })

  const response = await request(app).get('/api/joy')

  t.is(response.status, 200)
  t.true(stubs.listJoyRatings.calledOnce)
})

test('GET /api/joy/:id fetches specific joy rating', async t => {
  const controllerStubs = createJoyStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/joy.js',
    controllerPath: '#controllers/joyController.js',
    basePath: 'joy',
    controllerStubs,
  })

  const response = await request(app).get('/api/joy/joy-123')

  t.is(response.status, 200)
  t.deepEqual(response.body, { id: 'joy-123', rating: 5 })
  t.true(stubs.getJoyRating.calledOnce)
})

test('PUT /api/joy/:id updates joy rating', async t => {
  const controllerStubs = createJoyStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/joy.js',
    controllerPath: '#controllers/joyController.js',
    basePath: 'joy',
    controllerStubs,
  })

  const response = await request(app).put('/api/joy/joy-123').send({ rating: 4 })

  t.is(response.status, 200)
  t.deepEqual(response.body, { id: 'joy-123', rating: 4 })
  t.true(stubs.updateJoyRating.calledOnce)
})

test('DELETE /api/joy/:id deletes joy rating', async t => {
  const controllerStubs = createJoyStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/joy.js',
    controllerPath: '#controllers/joyController.js',
    basePath: 'joy',
    controllerStubs,
  })

  const response = await request(app).delete('/api/joy/joy-123')

  t.is(response.status, 204)
  t.true(stubs.deleteJoyRating.calledOnce)
})
