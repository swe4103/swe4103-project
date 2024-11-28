import test from 'ava'
import sinon from 'sinon'

import { setupTest } from '#__tests__/helpers/setupTest.js'

test('inviteUsers sends invitations successfully', async t => {
  const inviteData = {
    emails: ['test@example.com'],
    role: 'INSTRUCTOR',
    classId: 'class123',
  }

  const { service, createResponse } = await setupTest('#controllers/usersController.js', {
    '#schemas/users.js': {
      inviteSchema: {
        validate: () => ({ value: inviteData }),
      },
    },
    '#services/usersService.js': {
      inviteUsersByEmail: sinon.stub().resolves(),
    },
  })

  const mockReq = {
    body: {
      ...inviteData,
    },
  }
  const mockRes = createResponse()

  await service.inviteUsers(mockReq, mockRes)

  t.true(mockRes.status.calledWith(200))
  t.true(mockRes.json.calledWith({ message: 'INSTRUCTOR invitations sent successfully.' }))
})

test('inviteUsers handles validation error', async t => {
  const { service, createResponse } = await setupTest('#controllers/usersController.js', {
    '#schemas/users.js': {
      inviteSchema: {
        validate: () => ({ error: { details: [{ message: 'Invalid invite data' }] } }),
      },
    },
  })

  const mockReq = {
    body: {},
  }
  const mockRes = createResponse()

  await service.inviteUsers(mockReq, mockRes)

  t.true(mockRes.status.calledWith(400))
  t.true(mockRes.json.calledWith({ message: 'Invalid invite data' }))
})

test('getUser retrieves user successfully', async t => {
  const mockUser = {
    id: 'user123',
    email: 'test@example.com',
    displayName: 'Test User',
    role: 'INSTRUCTOR',
  }

  const { service, createResponse } = await setupTest('#controllers/usersController.js', {
    '#services/usersService.js': {
      getUserById: sinon.stub().resolves(mockUser),
    },
  })

  const mockReq = {
    params: { id: 'user123' },
  }
  const mockRes = createResponse()

  await service.getUser(mockReq, mockRes)

  t.true(mockRes.status.calledWith(200))
  t.true(mockRes.json.calledWith(mockUser))
})

test('getUser handles non-existent user', async t => {
  const { service, createResponse } = await setupTest('#controllers/usersController.js', {
    '#services/usersService.js': {
      getUserById: sinon.stub().resolves(null),
    },
  })

  const mockReq = {
    params: { id: 'nonexistent' },
  }
  const mockRes = createResponse()

  await service.getUser(mockReq, mockRes)

  t.true(mockRes.status.calledWith(404))
  t.true(mockRes.json.calledWith({ message: 'User not found' }))
})

test('updateUser updates user successfully', async t => {
  const mockUser = {
    id: 'user123',
    displayName: 'Updated Name',
  }

  const { service, createResponse } = await setupTest('#controllers/usersController.js', {
    '#schemas/users.js': {
      updateUserSchema: {
        validate: () => ({ value: { displayName: 'Updated Name' } }),
      },
    },
    '#services/usersService.js': {
      updateUserById: sinon.stub().resolves(mockUser),
    },
  })

  const mockReq = {
    params: { id: 'user123' },
    body: { displayName: 'Updated Name' },
  }
  const mockRes = createResponse()

  await service.updateUser(mockReq, mockRes)

  t.true(mockRes.status.calledWith(200))
  t.true(mockRes.json.calledWith(mockUser))
})

test('updateUser handles validation error', async t => {
  const { service, createResponse } = await setupTest('#controllers/usersController.js', {
    '#schemas/users.js': {
      updateUserSchema: {
        validate: () => ({ error: { details: [{ message: 'Invalid update data' }] } }),
      },
    },
  })

  const mockReq = {
    params: { id: 'user123' },
    body: {},
  }
  const mockRes = createResponse()

  await service.updateUser(mockReq, mockRes)

  t.true(mockRes.status.calledWith(400))
  t.true(mockRes.json.calledWith({ message: 'Invalid update data' }))
})

test('deleteUser deletes user successfully', async t => {
  const { service, createResponse } = await setupTest('#controllers/usersController.js', {
    '#services/usersService.js': {
      deleteUserById: sinon.stub().resolves('user123'),
    },
  })

  const mockReq = {
    params: { id: 'user123' },
  }
  const mockRes = createResponse()

  await service.deleteUser(mockReq, mockRes)

  t.true(mockRes.status.calledWith(204))
  t.true(mockRes.send.called)
})

test('deleteUser handles non-existent user', async t => {
  const { service, createResponse } = await setupTest('#controllers/usersController.js', {
    '#services/usersService.js': {
      deleteUserById: sinon.stub().resolves(null),
    },
  })

  const mockReq = {
    params: { id: 'user123' },
  }
  const mockRes = createResponse()

  await service.deleteUser(mockReq, mockRes)

  t.true(mockRes.status.calledWith(404))
  t.true(mockRes.json.calledWith({ message: 'User not found' }))
})

test.afterEach.always(() => {
  sinon.restore()
})
