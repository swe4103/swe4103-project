import test from 'ava'
import sinon from 'sinon'
import request from 'supertest'

import { setupRouteTest } from '#__tests__/helpers/setupRouteTest.js'

const createProjectStubs = () => ({
  createProject: sinon.stub().callsFake((req, res) => res.status(201).json({ id: 'project-123' })),
  listProjects: sinon.stub().callsFake((req, res) => res.status(200).json([])),
  getProject: sinon.stub().callsFake((req, res) => res.status(200).json({ id: req.params.id })),
  updateProject: sinon.stub().callsFake((req, res) => res.status(200).json({ id: req.params.id })),
  deleteProject: sinon.stub().callsFake((req, res) => res.status(204).send()),
})

test('POST /api/projects requires authentication', async t => {
  const controllerStubs = createProjectStubs()
  const { app, auth } = await setupRouteTest({
    routePath: '#routes/projects.js',
    controllerPath: '#controllers/projectsController.js',
    basePath: 'projects',
    controllerStubs,
  })

  auth.callsFake((req, res) => res.status(401).json({ message: 'Unauthorized' }))

  const response = await request(app).post('/api/projects').send({ name: 'Test Project' })

  t.is(response.status, 401)
  t.deepEqual(response.body, { message: 'Unauthorized' })
})

test('POST /api/projects creates project when authorized', async t => {
  const controllerStubs = createProjectStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/projects.js',
    controllerPath: '#controllers/projectsController.js',
    basePath: 'projects',
    controllerStubs,
  })

  const response = await request(app).post('/api/projects').send({ name: 'Test Project' })

  t.is(response.status, 201)
  t.deepEqual(response.body, { id: 'project-123' })
  t.true(stubs.createProject.calledOnce)
})

test('GET /api/projects fetches project list', async t => {
  const controllerStubs = createProjectStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/projects.js',
    controllerPath: '#controllers/projectsController.js',
    basePath: 'projects',
    controllerStubs,
  })

  const response = await request(app).get('/api/projects')

  t.is(response.status, 200)
  t.true(stubs.listProjects.calledOnce)
})

test('GET /api/projects/:id fetches specific project', async t => {
  const controllerStubs = createProjectStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/projects.js',
    controllerPath: '#controllers/projectsController.js',
    basePath: 'projects',
    controllerStubs,
  })

  const response = await request(app).get('/api/projects/project-123')

  t.is(response.status, 200)
  t.deepEqual(response.body, { id: 'project-123' })
  t.true(stubs.getProject.calledOnce)
})

test('PUT /api/projects/:id updates project', async t => {
  const controllerStubs = createProjectStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/projects.js',
    controllerPath: '#controllers/projectsController.js',
    basePath: 'projects',
    controllerStubs,
  })

  const response = await request(app)
    .put('/api/projects/project-123')
    .send({ name: 'Updated Project' })

  t.is(response.status, 200)
  t.true(stubs.updateProject.calledOnce)
})

test('DELETE /api/projects/:id deletes project', async t => {
  const controllerStubs = createProjectStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/projects.js',
    controllerPath: '#controllers/projectsController.js',
    basePath: 'projects',
    controllerStubs,
  })

  const response = await request(app).delete('/api/projects/project-123')

  t.is(response.status, 204)
  t.true(stubs.deleteProject.calledOnce)
})
