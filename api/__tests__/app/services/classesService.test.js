import test from 'ava'

import { setupTest } from '#__tests__/helpers/setupTest.js'

const normalizeQuery = query => query.replace(/\s+/g, ' ').trim()

test.beforeEach(async t => {
  t.context = await setupTest('#services/classesService.js')
})

test('createNewClass generates UUID and saves class record', async t => {
  const { service, stubs, mockUuid } = t.context
  const classData = {
    name: 'Test Class',
    teamId: 'team123',
    projectId: 'project123',
  }
  const expectedClass = { id: mockUuid, ...classData }

  stubs.database.saveRecord.resolves(expectedClass)

  const result = await service.createNewClass(classData)

  t.deepEqual(result, expectedClass)
  t.true(stubs.database.saveRecord.calledWith('Class', expectedClass))
})

test('getClassById retrieves class by ID', async t => {
  const { service, stubs } = t.context
  const mockClass = {
    id: '123',
    name: 'Test Class',
    teamId: 'team123',
  }

  stubs.database.getRecord.resolves(mockClass)

  const result = await service.getClassById('123')

  t.deepEqual(result, mockClass)
  t.true(stubs.database.getRecord.calledWith('Class', '123'))
})

test('deleteClassById deletes class by ID', async t => {
  const { service, stubs } = t.context
  stubs.database.deleteRecord.resolves('123')

  const result = await service.deleteClassById('123')

  t.is(result, '123')
  t.true(stubs.database.deleteRecord.calledWith('Class', '123'))
})

test('updateClassById updates class data', async t => {
  const { service, stubs } = t.context
  const updateData = { name: 'Updated Class Name' }
  const updatedClass = { id: '123', ...updateData }

  stubs.database.updateRecord.resolves(updatedClass)

  const result = await service.updateClassById('123', updateData)

  t.deepEqual(result, updatedClass)
  t.true(stubs.database.updateRecord.calledWith('Class', '123', updateData))
})

test('listClassesByIds throws error when no ID provided', async t => {
  const { service } = t.context

  const error = await t.throwsAsync(() => service.listClassesByIds({}), {
    message: 'Either teamId or projectId must be provided.',
  })

  t.truthy(error)
})

test('listClassesByIds queries by teamId', async t => {
  const { service, stubs, normalizeQuery } = t.context
  const mockClasses = [
    { id: '123', name: 'Class 1', teamId: 'team123' },
    { id: '456', name: 'Class 2', teamId: 'team123' },
  ]

  stubs.database.filterRecords.resolves(mockClasses)

  const result = await service.listClassesByIds({ teamId: 'team123' })

  t.deepEqual(result, mockClasses)

  const actualCall = stubs.database.filterRecords.getCall(0)
  const expectedQuery = 'SELECT * FROM c WHERE c.teamId = @teamId'

  t.is(normalizeQuery(actualCall.args[1].query), normalizeQuery(expectedQuery))
  t.deepEqual(actualCall.args[1].parameters, [{ name: '@teamId', value: 'team123' }])
})

test('listClassesByIds queries by projectId', async t => {
  const { service, stubs, normalizeQuery } = t.context
  const mockClasses = [
    { id: '123', name: 'Class 1', projectId: 'project123' },
    { id: '456', name: 'Class 2', projectId: 'project123' },
  ]

  stubs.database.filterRecords.resolves(mockClasses)

  const result = await service.listClassesByIds({ projectId: 'project123' })

  t.deepEqual(result, mockClasses)

  const actualCall = stubs.database.filterRecords.getCall(0)
  const expectedQuery = 'SELECT * FROM c WHERE c.projectId = @projectId'

  t.is(normalizeQuery(actualCall.args[1].query), normalizeQuery(expectedQuery))
  t.deepEqual(actualCall.args[1].parameters, [{ name: '@projectId', value: 'project123' }])
})

test('listClassesByIds queries by both teamId and projectId', async t => {
  const { service, stubs, normalizeQuery } = t.context
  const mockClasses = [{ id: '123', name: 'Class 1', teamId: 'team123', projectId: 'project123' }]

  stubs.database.filterRecords.resolves(mockClasses)

  const result = await service.listClassesByIds({
    teamId: 'team123',
    projectId: 'project123',
  })

  t.deepEqual(result, mockClasses)

  const actualCall = stubs.database.filterRecords.getCall(0)
  const expectedQuery = 'SELECT * FROM c WHERE c.teamId = @teamId AND c.projectId = @projectId'

  t.is(normalizeQuery(actualCall.args[1].query), normalizeQuery(expectedQuery))
  t.deepEqual(actualCall.args[1].parameters, [
    { name: '@teamId', value: 'team123' },
    { name: '@projectId', value: 'project123' },
  ])
})

test('listClassesByStudentId throws error when no studentId provided', async t => {
  const { service } = t.context

  const error = await t.throwsAsync(() => service.listClassesByStudentId(), {
    message: 'studentId must be provided.',
  })

  t.truthy(error)
})

test('listClassesByStudentId retrieves classes for student', async t => {
  const { service, stubs, normalizeQuery } = t.context
  const mockClasses = [
    { id: '123', name: 'Class 1', students: ['student123'] },
    { id: '456', name: 'Class 2', students: ['student123'] },
  ]

  stubs.database.filterRecords.resolves(mockClasses)

  const result = await service.listClassesByStudentId('student123')

  t.deepEqual(result, mockClasses)

  const actualCall = stubs.database.filterRecords.getCall(0)
  const expectedQuery = 'SELECT * FROM c WHERE ARRAY_CONTAINS(c.students, @studentId)'

  t.is(normalizeQuery(actualCall.args[1].query), normalizeQuery(expectedQuery))
  t.deepEqual(actualCall.args[1].parameters, [{ name: '@studentId', value: 'student123' }])
})
