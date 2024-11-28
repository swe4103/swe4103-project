import test from 'ava'
import sinon from 'sinon'
import request from 'supertest'

import { setupRouteTest } from '#__tests__/helpers/setupRouteTest.js'

const createTeamStubs = () => ({
  createTeam: sinon.stub().callsFake((req, res) => res.status(201).json({ id: 'team-123' })),
  listTeams: sinon.stub().callsFake((req, res) => res.status(200).json([])),
  getTeam: sinon.stub().callsFake((req, res) => res.status(200).json({ id: req.params.id })),
  updateTeam: sinon.stub().callsFake((req, res) => res.status(200).json({ id: req.params.id })),
  deleteTeam: sinon.stub().callsFake((req, res) => res.status(204).send()),
})

test('POST /api/teams requires authentication', async t => {
  const controllerStubs = createTeamStubs()
  const { app, auth } = await setupRouteTest({
    routePath: '#routes/teams.js',
    controllerPath: '#controllers/teamsController.js',
    basePath: 'teams',
    controllerStubs,
  })

  auth.callsFake((req, res) => res.status(401).json({ message: 'Unauthorized' }))

  const response = await request(app).post('/api/teams').send({ name: 'Test Team' })

  t.is(response.status, 401)
  t.deepEqual(response.body, { message: 'Unauthorized' })
})

test('POST /api/teams creates team when authorized', async t => {
  const controllerStubs = createTeamStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/teams.js',
    controllerPath: '#controllers/teamsController.js',
    basePath: 'teams',
    controllerStubs,
  })

  const response = await request(app).post('/api/teams').send({ name: 'Test Team' })

  t.is(response.status, 201)
  t.deepEqual(response.body, { id: 'team-123' })
  t.true(stubs.createTeam.calledOnce)
})

test('GET /api/teams fetches team list', async t => {
  const controllerStubs = createTeamStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/teams.js',
    controllerPath: '#controllers/teamsController.js',
    basePath: 'teams',
    controllerStubs,
  })

  const response = await request(app).get('/api/teams')

  t.is(response.status, 200)
  t.true(stubs.listTeams.calledOnce)
})

test('GET /api/teams/:id fetches specific team', async t => {
  const controllerStubs = createTeamStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/teams.js',
    controllerPath: '#controllers/teamsController.js',
    basePath: 'teams',
    controllerStubs,
  })

  const response = await request(app).get('/api/teams/team-123')

  t.is(response.status, 200)
  t.deepEqual(response.body, { id: 'team-123' })
  t.true(stubs.getTeam.calledOnce)
})

test('PUT /api/teams/:id updates team', async t => {
  const controllerStubs = createTeamStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/teams.js',
    controllerPath: '#controllers/teamsController.js',
    basePath: 'teams',
    controllerStubs,
  })

  const response = await request(app).put('/api/teams/team-123').send({ name: 'Updated Team' })

  t.is(response.status, 200)
  t.true(stubs.updateTeam.calledOnce)
})

test('DELETE /api/teams/:id deletes team', async t => {
  const controllerStubs = createTeamStubs()
  const { app, stubs } = await setupRouteTest({
    routePath: '#routes/teams.js',
    controllerPath: '#controllers/teamsController.js',
    basePath: 'teams',
    controllerStubs,
  })

  const response = await request(app).delete('/api/teams/team-123')

  t.is(response.status, 204)
  t.true(stubs.deleteTeam.calledOnce)
})
