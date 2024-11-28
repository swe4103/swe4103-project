import test from 'ava'
import sinon from 'sinon'

import { setupTest } from '#__tests__/helpers/setupTest.js'

test('createTeam creates a new team successfully', async t => {
  const mockTeam = { id: 'team123', name: 'Test Team', projectId: 'project123' }
  const { service, createResponse } = await setupTest('#controllers/teamsController.js', {
    '#schemas/teams.js': {
      teamSchema: {
        validate: () => ({ value: { name: 'Test Team', projectId: 'project123' } }),
      },
    },
    '#services/teamsService.js': {
      createNewTeam: sinon.stub().resolves(mockTeam),
    },
  })

  const mockReq = {
    body: { name: 'Test Team', projectId: 'project123' },
  }
  const mockRes = createResponse()

  await service.createTeam(mockReq, mockRes)

  t.true(mockRes.status.calledWith(201))
  t.true(mockRes.json.calledWith(mockTeam))
})

test('createTeam handles validation error', async t => {
  const { service, createResponse } = await setupTest('#controllers/teamsController.js', {
    '#schemas/teams.js': {
      teamSchema: {
        validate: () => ({ error: { details: [{ message: 'Invalid team data' }] } }),
      },
    },
  })

  const mockReq = {
    body: {},
  }
  const mockRes = createResponse()

  await service.createTeam(mockReq, mockRes)

  t.true(mockRes.status.calledWith(400))
  t.true(mockRes.json.calledWith({ message: 'Invalid team data' }))
})

test('listTeams retrieves teams successfully', async t => {
  const mockTeams = [{ id: 'team1' }, { id: 'team2' }]
  const { service, createResponse } = await setupTest('#controllers/teamsController.js', {
    '#schemas/teams.js': {
      listTeamsQuerySchema: {
        validate: () => ({ value: { projectId: 'project123' } }),
      },
    },
    '#services/teamsService.js': {
      listTeamsByProjectId: sinon.stub().resolves(mockTeams),
    },
  })

  const mockReq = {
    query: { projectId: 'project123' },
  }
  const mockRes = createResponse()

  await service.listTeams(mockReq, mockRes)

  t.true(mockRes.status.calledWith(200))
  t.true(mockRes.json.calledWith(mockTeams))
})

test('listTeams handles empty result', async t => {
  const { service, createResponse } = await setupTest('#controllers/teamsController.js', {
    '#schemas/teams.js': {
      listTeamsQuerySchema: {
        validate: () => ({ value: { projectId: 'project123' } }),
      },
    },
    '#services/teamsService.js': {
      listTeamsByProjectId: sinon.stub().resolves(null),
    },
  })

  const mockReq = {
    query: { projectId: 'project123' },
  }
  const mockRes = createResponse()

  await service.listTeams(mockReq, mockRes)

  t.true(mockRes.status.calledWith(200))
  t.true(mockRes.json.calledWith([]))
})

test('getTeam retrieves team successfully', async t => {
  const mockTeam = { id: 'team123', name: 'Test Team' }
  const { service, createResponse } = await setupTest('#controllers/teamsController.js', {
    '#services/teamsService.js': {
      getTeamById: sinon.stub().resolves(mockTeam),
    },
  })

  const mockReq = {
    params: { id: 'team123' },
  }
  const mockRes = createResponse()

  await service.getTeam(mockReq, mockRes)

  t.true(mockRes.status.calledWith(200))
  t.true(mockRes.json.calledWith(mockTeam))
})

test('getTeam handles non-existent team', async t => {
  const { service, createResponse } = await setupTest('#controllers/teamsController.js', {
    '#services/teamsService.js': {
      getTeamById: sinon.stub().resolves(null),
    },
  })

  const mockReq = {
    params: { id: 'nonexistent' },
  }
  const mockRes = createResponse()

  await service.getTeam(mockReq, mockRes)

  t.true(mockRes.status.calledWith(404))
  t.true(mockRes.json.calledWith({ message: 'Team not found' }))
})

test('updateTeam updates team successfully', async t => {
  const mockTeam = { id: 'team123', name: 'Updated Team' }
  const { service, createResponse } = await setupTest('#controllers/teamsController.js', {
    '#schemas/teams.js': {
      updateTeamSchema: {
        validate: () => ({ value: { name: 'Updated Team' } }),
      },
    },
    '#services/teamsService.js': {
      updateTeamById: sinon.stub().resolves(mockTeam),
    },
  })

  const mockReq = {
    params: { id: 'team123' },
    body: { name: 'Updated Team' },
  }
  const mockRes = createResponse()

  await service.updateTeam(mockReq, mockRes)

  t.true(mockRes.status.calledWith(200))
  t.true(mockRes.json.calledWith(mockTeam))
})

test('deleteTeam deletes team successfully', async t => {
  const { service, createResponse } = await setupTest('#controllers/teamsController.js', {
    '#services/teamsService.js': {
      deleteTeamById: sinon.stub().resolves('team123'),
    },
  })

  const mockReq = {
    params: { id: 'team123' },
  }
  const mockRes = createResponse()

  await service.deleteTeam(mockReq, mockRes)

  t.true(mockRes.status.calledWith(204))
  t.true(mockRes.send.called)
})

test('deleteTeam handles non-existent team', async t => {
  const { service, createResponse } = await setupTest('#controllers/teamsController.js', {
    '#services/teamsService.js': {
      deleteTeamById: sinon.stub().resolves(null),
    },
  })

  const mockReq = {
    params: { id: 'team123' },
  }
  const mockRes = createResponse()

  await service.deleteTeam(mockReq, mockRes)

  t.true(mockRes.status.calledWith(404))
  t.true(mockRes.json.calledWith({ message: 'Team not found' }))
})
