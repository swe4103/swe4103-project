import esmock from 'esmock'
import sinon from 'sinon'

import { createDatabaseStubs } from './setupDatabase.js'
import { createEmailStubs } from './setupEmail.js'

import config from '#config'
import roles from '#constants/roles.js'

const normalizeQuery = query => query.replace(/\s+/g, ' ').trim()

export const setupTest = async (servicePath, additionalMocks = {}) => {
  const databaseStubs = createDatabaseStubs()
  const emailStubs = createEmailStubs()
  const mockUuid = '12345678-1234-1234-1234-123456789012'

  const mockEmailClient = {
    beginSend: sinon.stub().resolves({
      pollUntilDone: sinon.stub().resolves({
        messageId: 'mock-message-id',
      }),
    }),
  }

  const defaultMocks = {
    '#services/DatabaseService.js': databaseStubs,
    '@azure/communication-email': {
      EmailClient: function () {
        return mockEmailClient
      },
    },
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
  }
}
