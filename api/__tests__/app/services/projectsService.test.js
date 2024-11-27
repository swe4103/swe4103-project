import test from 'ava'

import { setupTest } from '#__tests__/helpers/setupTest.js'

test.beforeEach(async t => {
  t.context = await setupTest('#services/projectsService.js')
})

test('createNewProject generates UUID and saves project record', async t => {
  const { service, stubs, mockUuid } = t.context
  const projectData = {
    name: 'Test Project',
    classId: 'class123',
    description: 'A test project',
  }
  const expectedProject = { id: mockUuid, ...projectData }

  stubs.database.saveRecord.resolves(expectedProject)

  const result = await service.createNewProject(projectData)

  t.deepEqual(result, expectedProject)
  t.true(stubs.database.saveRecord.calledWith('Project', expectedProject))
})

test('getProjectById retrieves project by ID', async t => {
  const { service, stubs } = t.context
  const mockProject = {
    id: '123',
    name: 'Test Project',
    classId: 'class123',
    description: 'A test project',
  }

  stubs.database.getRecord.resolves(mockProject)

  const result = await service.getProjectById('123')

  t.deepEqual(result, mockProject)
  t.true(stubs.database.getRecord.calledWith('Project', '123'))
})

test('deleteProjectById deletes project by ID', async t => {
  const { service, stubs } = t.context
  stubs.database.deleteRecord.resolves('123')

  const result = await service.deleteProjectById('123')

  t.is(result, '123')
  t.true(stubs.database.deleteRecord.calledWith('Project', '123'))
})

test('updateProjectById updates project data', async t => {
  const { service, stubs } = t.context
  const updateData = { name: 'Updated Project Name' }
  const updatedProject = { id: '123', ...updateData }

  stubs.database.updateRecord.resolves(updatedProject)

  const result = await service.updateProjectById('123', updateData)

  t.deepEqual(result, updatedProject)
  t.true(stubs.database.updateRecord.calledWith('Project', '123', updateData))
})

test('listProjectsByClassId throws error when no classId provided', async t => {
  const { service } = t.context

  const error = await t.throwsAsync(() => service.listProjectsByClassId({}), {
    message: 'classId must be provided.',
  })

  t.truthy(error)
})

test('listProjectsByClassId retrieves projects for class', async t => {
  const { service, stubs, normalizeQuery } = t.context
  const mockProjects = [
    { id: '123', name: 'Project 1', classId: 'class123' },
    { id: '456', name: 'Project 2', classId: 'class123' },
  ]

  stubs.database.filterRecords.resolves(mockProjects)

  const result = await service.listProjectsByClassId({ classId: 'class123' })

  t.deepEqual(result, mockProjects)

  const actualCall = stubs.database.filterRecords.getCall(0)
  const expectedQuery = 'SELECT * FROM c WHERE c.classId = @classId'

  t.is(normalizeQuery(actualCall.args[1].query), normalizeQuery(expectedQuery))
  t.deepEqual(actualCall.args[1].parameters, [{ name: '@classId', value: 'class123' }])
})
