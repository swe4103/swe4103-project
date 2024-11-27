import test from 'ava'

import { setupTest } from '#__tests__/helpers/setupTest.js'

test.beforeEach(async t => {
  t.context = await setupTest('#services/joyService.js')
})

test('createJoy generates UUID and saves joy rating record', async t => {
  const { service, stubs, mockUuid } = t.context
  const joyData = {
    userId: 'user123',
    teamId: 'team123',
    rating: 4,
    date: '2024-01-01',
  }
  const expectedJoy = { id: mockUuid, ...joyData }

  stubs.database.saveRecord.resolves(expectedJoy)

  const result = await service.createJoy(joyData)

  t.deepEqual(result, expectedJoy)
  t.true(stubs.database.saveRecord.calledWith('JoyRating', expectedJoy))
})

test('getJoyById retrieves joy rating by ID', async t => {
  const { service, stubs } = t.context
  const mockJoy = {
    id: '123',
    userId: 'user123',
    teamId: 'team123',
    rating: 4,
    date: '2024-01-01',
  }

  stubs.database.getRecord.resolves(mockJoy)

  const result = await service.getJoyById('123')

  t.deepEqual(result, mockJoy)
  t.true(stubs.database.getRecord.calledWith('JoyRating', '123'))
})

test('deleteJoyById deletes joy rating by ID', async t => {
  const { service, stubs } = t.context
  stubs.database.deleteRecord.resolves('123')

  const result = await service.deleteJoyById('123')

  t.is(result, '123')
  t.true(stubs.database.deleteRecord.calledWith('JoyRating', '123'))
})

test('updateJoyById updates joy rating data', async t => {
  const { service, stubs } = t.context
  const updateData = { rating: 5 }
  const updatedJoy = { id: '123', ...updateData }

  stubs.database.updateRecord.resolves(updatedJoy)

  const result = await service.updateJoyById('123', updateData)

  t.deepEqual(result, updatedJoy)
  t.true(stubs.database.updateRecord.calledWith('JoyRating', '123', updateData))
})

test('listJoys throws error when no userId or teamId provided', async t => {
  const { service } = t.context

  const error = await t.throwsAsync(() => service.listJoys({}), {
    message: 'Either userId or teamId must be provided.',
  })

  t.truthy(error)
})

test('listJoys queries by userId only', async t => {
  const { service, stubs, normalizeQuery } = t.context
  const mockJoys = [
    { id: '123', userId: 'user123', rating: 4, date: '2024-01-01' },
    { id: '456', userId: 'user123', rating: 5, date: '2024-01-02' },
  ]

  stubs.database.filterRecords.resolves(mockJoys)

  const result = await service.listJoys({ userId: 'user123' })

  t.deepEqual(result, mockJoys)

  const actualCall = stubs.database.filterRecords.getCall(0)
  const expectedQuery = 'SELECT * FROM c WHERE c.userId = @userId'

  t.is(normalizeQuery(actualCall.args[1].query), normalizeQuery(expectedQuery))
  t.deepEqual(actualCall.args[1].parameters, [{ name: '@userId', value: 'user123' }])
})

test('listJoys queries by teamId only', async t => {
  const { service, stubs, normalizeQuery } = t.context
  const mockJoys = [
    { id: '123', teamId: 'team123', rating: 4, date: '2024-01-01' },
    { id: '456', teamId: 'team123', rating: 5, date: '2024-01-02' },
  ]

  stubs.database.filterRecords.resolves(mockJoys)

  const result = await service.listJoys({ teamId: 'team123' })

  t.deepEqual(result, mockJoys)

  const actualCall = stubs.database.filterRecords.getCall(0)
  const expectedQuery = 'SELECT * FROM c WHERE c.teamId = @teamId'

  t.is(normalizeQuery(actualCall.args[1].query), normalizeQuery(expectedQuery))
  t.deepEqual(actualCall.args[1].parameters, [{ name: '@teamId', value: 'team123' }])
})

test('listJoys queries with all parameters', async t => {
  const { service, stubs, normalizeQuery } = t.context
  const mockJoys = [
    { id: '123', userId: 'user123', teamId: 'team123', rating: 4, date: '2024-01-01' },
  ]

  stubs.database.filterRecords.resolves(mockJoys)

  const result = await service.listJoys({
    userId: 'user123',
    teamId: 'team123',
    fromDate: '2024-01-01',
    toDate: '2024-01-31',
  })

  t.deepEqual(result, mockJoys)

  const actualCall = stubs.database.filterRecords.getCall(0)
  const expectedQuery =
    'SELECT * FROM c WHERE c.userId = @userId AND c.teamId = @teamId AND c.date >= @fromDate AND c.date <= @toDate'

  t.is(normalizeQuery(actualCall.args[1].query), normalizeQuery(expectedQuery))
  t.deepEqual(actualCall.args[1].parameters, [
    { name: '@userId', value: 'user123' },
    { name: '@teamId', value: 'team123' },
    { name: '@fromDate', value: '2024-01-01' },
    { name: '@toDate', value: '2024-01-31' },
  ])
})

test('listJoys queries with userId and date range', async t => {
  const { service, stubs, normalizeQuery } = t.context
  const mockJoys = [
    { id: '123', userId: 'user123', rating: 4, date: '2024-01-01' },
    { id: '456', userId: 'user123', rating: 5, date: '2024-01-15' },
  ]

  stubs.database.filterRecords.resolves(mockJoys)

  const result = await service.listJoys({
    userId: 'user123',
    fromDate: '2024-01-01',
    toDate: '2024-01-31',
  })

  t.deepEqual(result, mockJoys)

  const actualCall = stubs.database.filterRecords.getCall(0)
  const expectedQuery =
    'SELECT * FROM c WHERE c.userId = @userId AND c.date >= @fromDate AND c.date <= @toDate'

  t.is(normalizeQuery(actualCall.args[1].query), normalizeQuery(expectedQuery))
  t.deepEqual(actualCall.args[1].parameters, [
    { name: '@userId', value: 'user123' },
    { name: '@fromDate', value: '2024-01-01' },
    { name: '@toDate', value: '2024-01-31' },
  ])
})
