import test from 'ava'
import esmock from 'esmock'
import sinon from 'sinon'

test.beforeEach(async t => {
  // Create mock responses
  const mockItemResponse = { resource: null }
  const mockQueryResponse = { resources: [] }

  // Create container mock
  const containerMock = {
    items: {
      create: sinon.stub().resolves(mockItemResponse),
      upsert: sinon.stub().resolves(mockItemResponse),
      query: sinon.stub().returns({
        fetchAll: sinon.stub().resolves(mockQueryResponse),
      }),
    },
    item: sinon.stub().returns({
      read: sinon.stub().resolves(mockItemResponse),
      delete: sinon.stub().resolves(mockItemResponse),
    }),
  }

  // Create database mock
  const databaseMock = {
    container: sinon.stub().returns(containerMock),
  }

  // Create CosmosClient mock
  const cosmosClientMock = {
    database: sinon.stub().returns(databaseMock),
  }

  const databaseService = await esmock('#services/DatabaseService.js', {
    '@azure/cosmos': {
      CosmosClient: function () {
        return cosmosClientMock
      },
    },
  })

  t.context = {
    service: databaseService,
    mocks: {
      container: containerMock,
      database: databaseMock,
      cosmos: cosmosClientMock,
    },
  }

  databaseService.initializeDatabase()
})

test('saveRecord creates a new record successfully', async t => {
  const { service, mocks } = t.context
  const mockRecord = { id: '123', name: 'Test User' }
  mocks.container.items.create.resolves({ resource: mockRecord })

  const result = await service.saveRecord('User', mockRecord)

  t.deepEqual(result, mockRecord)
  t.true(mocks.container.items.create.calledOnce)
})

test('getRecord retrieves a record successfully', async t => {
  const { service, mocks } = t.context
  const mockRecord = { id: '123', name: 'Test User' }
  const itemMock = mocks.container.item()
  itemMock.read.resolves({ resource: mockRecord })

  const result = await service.getRecord('User', '123')

  t.deepEqual(result, mockRecord)
  t.true(itemMock.read.calledOnce)
})

test('updateRecord updates existing record successfully', async t => {
  const { service, mocks } = t.context
  const existingRecord = { id: '123', name: 'Old Name' }
  const updatedRecord = { id: '123', name: 'New Name' }

  const itemMock = mocks.container.item()
  itemMock.read.resolves({ resource: existingRecord })
  mocks.container.items.upsert.resolves({ resource: updatedRecord })

  const result = await service.updateRecord('User', '123', { name: 'New Name' })

  t.deepEqual(result, updatedRecord)
})

test('upsertRecord performs upsert successfully', async t => {
  const { service, mocks } = t.context
  const record = { id: '123', name: 'Test User' }
  mocks.container.items.upsert.resolves({ resource: record })

  const result = await service.upsertRecord('User', record)

  t.deepEqual(result, record)
  t.true(mocks.container.items.upsert.calledOnce)
})

test('filterRecords retrieves filtered records successfully', async t => {
  const { service, mocks } = t.context
  const mockRecords = [{ id: '123', name: 'Test User' }]
  const queryMock = mocks.container.items.query()
  queryMock.fetchAll.resolves({ resources: mockRecords })

  const result = await service.filterRecords('User', { query: 'SELECT * FROM c' })

  t.deepEqual(result, mockRecords)
})

test('listRecords retrieves records by field successfully', async t => {
  const { service, mocks } = t.context
  const mockRecords = [{ id: '123', name: 'Test User' }]
  const queryMock = mocks.container.items.query()
  queryMock.fetchAll.resolves({ resources: mockRecords })

  const result = await service.listRecords('User', 'name', 'Test User')

  t.deepEqual(result, mockRecords)
})

test('deleteRecord deletes record successfully', async t => {
  const { service, mocks } = t.context
  const id = '123'
  const itemMock = mocks.container.item()
  itemMock.delete.resolves({ resource: true })

  const result = await service.deleteRecord('User', id)

  t.is(result, id)
  t.true(itemMock.delete.calledOnce)
})

test('throws error for unknown container type', async t => {
  const { service } = t.context

  const error = await t.throwsAsync(() => service.saveRecord('Unknown', {}))
  t.is(error.message, 'Unknown record type: Unknown')
})
