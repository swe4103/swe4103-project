import test from 'ava'

import { setupTest } from '#__tests__/helpers/setupTest.js'

test.beforeEach(async t => {
  t.context = await setupTest('#services/teamsService.js')
})

test('createNewTeam generates UUID and saves team record', async t => {
  const { service, stubs, mockUuid } = t.context
  const teamData = {
    name: 'Test Team',
    projectId: 'project123',
    users: ['user1', 'user2'],
  }
  const expectedTeam = { id: mockUuid, ...teamData }

  stubs.database.saveRecord.resolves(expectedTeam)

  const result = await service.createNewTeam(teamData)

  t.deepEqual(result, expectedTeam)
  t.true(stubs.database.saveRecord.calledWith('Team', expectedTeam))
})

test('getTeamById retrieves team by ID', async t => {
  const { service, stubs } = t.context
  const mockTeam = {
    id: '123',
    name: 'Test Team',
    projectId: 'project123',
    users: ['user1', 'user2'],
  }

  stubs.database.getRecord.resolves(mockTeam)

  const result = await service.getTeamById('123')

  t.deepEqual(result, mockTeam)
  t.true(stubs.database.getRecord.calledWith('Team', '123'))
})

test('deleteTeamById deletes team by ID', async t => {
  const { service, stubs } = t.context
  stubs.database.deleteRecord.resolves('123')

  const result = await service.deleteTeamById('123')

  t.is(result, '123')
  t.true(stubs.database.deleteRecord.calledWith('Team', '123'))
})

test('updateTeamById updates team data', async t => {
  const { service, stubs } = t.context
  const updateData = { name: 'Updated Team Name' }
  const updatedTeam = { id: '123', ...updateData }

  stubs.database.updateRecord.resolves(updatedTeam)

  const result = await service.updateTeamById('123', updateData)

  t.deepEqual(result, updatedTeam)
  t.true(stubs.database.updateRecord.calledWith('Team', '123', updateData))
})

test('listTeamsByProjectId throws error when no projectId provided', async t => {
  const { service } = t.context

  const error = await t.throwsAsync(() => service.listTeamsByProjectId({}), {
    message: 'projectId must be provided.',
  })

  t.truthy(error)
})

test('listTeamsByProjectId retrieves teams for project', async t => {
  const { service, stubs, normalizeQuery } = t.context
  const mockTeams = [
    { id: '123', name: 'Team 1', projectId: 'project123' },
    { id: '456', name: 'Team 2', projectId: 'project123' },
  ]

  stubs.database.filterRecords.resolves(mockTeams)

  const result = await service.listTeamsByProjectId({ projectId: 'project123' })

  t.deepEqual(result, mockTeams)

  const actualCall = stubs.database.filterRecords.getCall(0)
  const expectedQuery = 'SELECT * FROM c WHERE c.projectId = @projectId'

  t.is(normalizeQuery(actualCall.args[1].query), normalizeQuery(expectedQuery))
  t.deepEqual(actualCall.args[1].parameters, [{ name: '@projectId', value: 'project123' }])
})
