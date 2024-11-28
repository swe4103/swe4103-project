import test from 'ava'
import sinon from 'sinon'
import request from 'supertest'

import { setupRouteTest } from '#__tests__/helpers/setupRouteTest.js'

const createClassStubs = () => ({
  createClass: sinon
    .stub()
    .callsFake((req, res) => res.status(201).json({ id: 'class-123', name: 'Test Class' })),
  listClasses: sinon.stub().callsFake((req, res) => res.status(200).json([])),
  listStudentClasses: sinon.stub().callsFake((req, res) => res.status(200).json([])),
  getClass: sinon
    .stub()
    .callsFake((req, res) => res.status(200).json({ id: req.params.id, name: 'Test Class' })),
  updateClass: sinon
    .stub()
    .callsFake((req, res) => res.status(200).json({ id: req.params.id, name: 'Updated Class' })),
  deleteClass: sinon.stub().callsFake((req, res) => res.status(204).send()),
})

test('POST /api/classes requires authentication', async t => {
  const controllerStubs = createClassStubs()
  const { app, auth } = await setupRouteTest({
    routePath: '#routes/classes.js',
    controllerPath: '#controllers/classesController.js',
    basePath: 'classes',
    controllerStubs,
  })

  auth.callsFake((req, res) => res.status(401).json({ message: 'Unauthorized' }))

  const response = await request(app).post('/api/classes').send({ name: 'New Class' })

  t.is(response.status, 401)
  t.deepEqual(response.body, { message: 'Unauthorized' })
})

test('POST /api/classes creates class when authorized', async t => {
  const controllerStubs = createClassStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/classes.js',
    controllerPath: '#controllers/classesController.js',
    basePath: 'classes',
    controllerStubs,
  })

  const response = await request(app).post('/api/classes').send({ name: 'Test Class' })

  t.is(response.status, 201)
  t.deepEqual(response.body, { id: 'class-123', name: 'Test Class' })
  t.true(stubs.createClass.calledOnce)
})

test('GET /api/classes fetches class list', async t => {
  const controllerStubs = createClassStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/classes.js',
    controllerPath: '#controllers/classesController.js',
    basePath: 'classes',
    controllerStubs,
  })

  const response = await request(app).get('/api/classes')

  t.is(response.status, 200)
  t.true(stubs.listClasses.calledOnce)
})

test('GET /api/classes/student/:id fetches student classes', async t => {
  const controllerStubs = createClassStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/classes.js',
    controllerPath: '#controllers/classesController.js',
    basePath: 'classes',
    controllerStubs,
  })

  const response = await request(app).get('/api/classes/student/student-123')

  t.is(response.status, 200)
  t.true(stubs.listStudentClasses.calledOnce)
})

test('GET /api/classes/:id fetches specific class', async t => {
  const controllerStubs = createClassStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/classes.js',
    controllerPath: '#controllers/classesController.js',
    basePath: 'classes',
    controllerStubs,
  })

  const response = await request(app).get('/api/classes/class-123')

  t.is(response.status, 200)
  t.deepEqual(response.body, { id: 'class-123', name: 'Test Class' })
  t.true(stubs.getClass.calledOnce)
})

test('PUT /api/classes/:id updates class', async t => {
  const controllerStubs = createClassStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/classes.js',
    controllerPath: '#controllers/classesController.js',
    basePath: 'classes',
    controllerStubs,
  })

  const response = await request(app).put('/api/classes/class-123').send({ name: 'Updated Class' })

  t.is(response.status, 200)
  t.deepEqual(response.body, { id: 'class-123', name: 'Updated Class' })
  t.true(stubs.updateClass.calledOnce)
})

test('DELETE /api/classes/:id deletes class', async t => {
  const controllerStubs = createClassStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/classes.js',
    controllerPath: '#controllers/classesController.js',
    basePath: 'classes',
    controllerStubs,
  })

  const response = await request(app).delete('/api/classes/class-123')

  t.is(response.status, 204)
  t.true(stubs.deleteClass.calledOnce)
})
