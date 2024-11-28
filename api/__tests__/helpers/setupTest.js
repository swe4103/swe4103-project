import esmock from 'esmock'
import sinon from 'sinon'

import { createDatabaseStubs } from './setupDatabase.js'
import { createEmailStubs } from './setupEmail.js'

import config from '#config'
import roles from '#constants/roles.js'

const normalizeQuery = query => query.replace(/\s+/g, ' ').trim()

const createMockResponse = () => {
  const jsonStub = sinon.stub()
  const statusStub = sinon.stub()
  const sendStub = sinon.stub()
  const mockRes = {
    status: statusStub,
    json: jsonStub,
    send: sendStub,
  }
  statusStub.returns(mockRes)
  return mockRes
}

export const setupTest = async (servicePath, additionalMocks = {}) => {
  const databaseStubs = createDatabaseStubs()
  const emailStubs = createEmailStubs()
  const mockUuid = '12345678-1234-1234-1234-123456789012'

  const defaultMocks = {
    '#services/DatabaseService.js': databaseStubs,
    '#services/emailService.js': emailStubs,
    'uuid': { v4: () => mockUuid },
    'jsonwebtoken': {
      sign: sinon.stub().returns('mock.jwt.token'),
    },
    '#config': config,
    '#constants/roles.js': roles,
  }

  const service = await esmock(servicePath, {
    ...defaultMocks,
    ...additionalMocks,
  })

  return {
    service,
    stubs: {
      database: databaseStubs,
      email: emailStubs,
    },
    mockUuid,
    config,
    roles,
    normalizeQuery,
    createResponse: createMockResponse,
  }
}
