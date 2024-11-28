import test from 'ava'
import bcrypt from 'bcryptjs'
import sinon from 'sinon'

import { setupTest } from '#__tests__/helpers/setupTest.js'

test('login succeeds with valid credentials', async t => {
  const mockUser = {
    id: 'user123',
    email: 'test@example.com',
    password: 'hashedPassword',
    displayName: 'Test User',
    groups: [],
    role: 'student',
  }

  const { service } = await setupTest('#controllers/authController.js', {
    '#services/usersService.js': {
      getUserByEmail: sinon.stub().resolves(mockUser),
    },
    'bcryptjs': {
      compare: sinon.stub().resolves(true),
    },
  })

  const mockReq = {
    body: {
      email: 'test@example.com',
      password: 'correctPassword',
    },
  }

  const jsonStub = sinon.stub()
  const statusStub = sinon.stub()
  const mockRes = {
    json: jsonStub,
    status: statusStub,
  }
  statusStub.returns(mockRes)

  await service.login(mockReq, mockRes)

  t.true(jsonStub.calledOnce)
  const response = jsonStub.firstCall.args[0]
  t.truthy(response.token)
  t.deepEqual(response.user, {
    id: mockUser.id,
    email: mockUser.email,
    displayName: mockUser.displayName,
    groups: mockUser.groups,
    role: mockUser.role,
  })
})

test('login fails with invalid password', async t => {
  const mockUser = {
    id: 'user123',
    email: 'test@example.com',
    password: 'hashedPassword',
  }

  const { service } = await setupTest('#controllers/authController.js', {
    '#services/usersService.js': {
      getUserByEmail: sinon.stub().resolves(mockUser),
    },
    'bcryptjs': {
      compare: sinon.stub().resolves(false),
    },
  })

  const mockReq = {
    body: {
      email: 'test@example.com',
      password: 'wrongPassword',
    },
  }

  const jsonStub = sinon.stub()
  const statusStub = sinon.stub()
  const mockRes = {
    json: jsonStub,
    status: statusStub,
  }
  statusStub.returns(mockRes)

  await service.login(mockReq, mockRes)

  t.true(statusStub.calledWith(401))
  t.true(jsonStub.calledWith({ message: 'Invalid email or password' }))
})

test('logout successfully blacklists token', async t => {
  const { service } = await setupTest('#controllers/authController.js', {
    '#services/blacklistCache.js': {
      blacklist: sinon.stub().returns(true),
    },
  })

  const mockReq = {
    headers: {
      authorization: 'Bearer validToken123',
    },
  }

  const jsonStub = sinon.stub()
  const statusStub = sinon.stub()
  const mockRes = {
    json: jsonStub,
    status: statusStub,
  }
  statusStub.returns(mockRes)

  await service.logout(mockReq, mockRes)

  t.true(statusStub.calledWith(200))
  t.true(jsonStub.calledWith({ message: 'Logged out successfully' }))
})

test('register creates new student user and updates class', async t => {
  const hashedPassword = 'hashedPassword123'
  const mockClass = {
    id: 'class123',
    students: [],
  }
  const mockNewUser = {
    id: 'user123',
    email: 'student@example.com',
    displayName: 'New Student',
    role: 'student',
  }

  const { service } = await setupTest('#controllers/authController.js', {
    '#schemas/users.js': {
      registerSchema: {
        validate: () => ({ value: { displayName: 'New Student', password: 'password123' } }),
      },
    },
    'bcryptjs': {
      hash: sinon.stub().resolves(hashedPassword),
    },
    '#services/usersService.js': {
      createUser: sinon.stub().resolves(mockNewUser),
    },
    '#services/DatabaseService.js': {
      getRecord: sinon.stub().resolves(mockClass),
      upsertRecord: sinon.stub().resolves(true),
    },
    '#services/blacklistCache.js': {
      blacklist: sinon.stub().returns(true),
    },
  })

  const mockReq = {
    invitee: {
      email: 'student@example.com',
      role: 'student',
      classId: 'class123',
    },
    body: {
      displayName: 'New Student',
      password: 'password123',
    },
    query: {
      token: 'validToken123',
    },
  }

  const jsonStub = sinon.stub()
  const statusStub = sinon.stub()
  const mockRes = {
    json: jsonStub,
    status: statusStub,
  }
  statusStub.returns(mockRes)

  await service.register(mockReq, mockRes)

  t.true(statusStub.calledWith(201))
  t.true(jsonStub.calledWith({ message: 'User registered successfully' }))
})

test('validateToken returns valid for good token', async t => {
  const mockDecoded = { id: 'user123', role: 'student' }

  const { service } = await setupTest('#controllers/authController.js', {
    'jsonwebtoken': {
      verify: sinon.stub().returns(mockDecoded),
    },
    '#services/blacklistCache.js': {
      isBlacklisted: sinon.stub().returns(false),
    },
  })

  const mockReq = {
    query: {
      token: 'validToken123',
      type: 'auth',
    },
  }

  const jsonStub = sinon.stub()
  const mockRes = {
    json: jsonStub,
  }

  await service.validateToken(mockReq, mockRes)

  t.true(
    jsonStub.calledWith({
      valid: true,
      decoded: mockDecoded,
    }),
  )
})

test('validateToken returns invalid for blacklisted token', async t => {
  const { service } = await setupTest('#controllers/authController.js', {
    'jsonwebtoken': {
      verify: sinon.stub().returns({ id: 'user123' }),
    },
    '#services/blacklistCache.js': {
      isBlacklisted: sinon.stub().returns(true),
    },
  })

  const mockReq = {
    query: {
      token: 'blacklistedToken',
      type: 'auth',
    },
  }

  const jsonStub = sinon.stub()
  const mockRes = {
    json: jsonStub,
  }

  await service.validateToken(mockReq, mockRes)

  t.true(
    jsonStub.calledWith({
      valid: false,
      error: 'Token is blacklisted',
    }),
  )
})
