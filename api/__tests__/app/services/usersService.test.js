import test from 'ava'

import { setupTest } from '#__tests__/helpers/setupTest.js'

test.beforeEach(async t => {
  t.context = await setupTest('#services/usersService.js')
})

test('createUser generates UUID and saves user record', async t => {
  const { service, stubs, mockUuid } = t.context
  const userData = { name: 'Test User', email: 'test@example.com' }
  const expectedUser = { id: mockUuid, ...userData }

  stubs.database.saveRecord.resolves(expectedUser)

  const result = await service.createUser(userData)

  t.deepEqual(result, expectedUser)
  t.true(stubs.database.saveRecord.calledWith('User', expectedUser))
})

test('getUserById retrieves user by ID', async t => {
  const { service, stubs } = t.context
  const mockUser = { id: '123', name: 'Test User' }

  stubs.database.getRecord.resolves(mockUser)

  const result = await service.getUserById('123')

  t.deepEqual(result, mockUser)
  t.true(stubs.database.getRecord.calledWith('User', '123'))
})

test('getUserByEmail returns first matching user', async t => {
  const { service, stubs } = t.context
  const mockUser = { id: '123', email: 'test@example.com' }

  stubs.database.listRecords.resolves([mockUser])

  const result = await service.getUserByEmail('test@example.com')

  t.deepEqual(result, mockUser)
  t.true(stubs.database.listRecords.calledWith('User', 'email', 'test@example.com'))
})

test('getUsersByEmails retrieves multiple users', async t => {
  const { service, stubs } = t.context
  const emails = ['test1@example.com', 'test2@example.com']
  const mockUsers = [
    { id: '123', email: 'test1@example.com' },
    { id: '456', email: 'test2@example.com' },
  ]

  stubs.database.filterRecords.resolves(mockUsers)

  const result = await service.getUsersByEmails(emails)

  t.deepEqual(result, mockUsers)
  t.true(
    stubs.database.filterRecords.calledWith('User', {
      query: 'SELECT * FROM c WHERE ARRAY_CONTAINS(@emails, c.email)',
      parameters: [{ name: '@emails', value: emails }],
    }),
  )
})

test('inviteUsersByEmail handles class invitations', async t => {
  const { service, stubs } = t.context
  const existingUser = { id: '123', email: 'existing@example.com' }
  const classData = {
    id: '456',
    name: 'Test Class',
    students: [],
  }

  stubs.database.filterRecords.resolves([existingUser])
  stubs.database.getRecord.resolves(classData)

  await service.inviteUsersByEmail({
    emails: ['existing@example.com', 'new@example.com'],
    role: 'student',
    classId: '456',
  })

  t.true(
    stubs.database.upsertRecord.calledWith('Class', {
      ...classData,
      students: [[existingUser.id]],
    }),
  )
  t.true(
    stubs.email.sendConfirmationEmail.calledWith(
      existingUser.email,
      `You have been invited to join ${classData.name} on Time Flow! Register using the following link:`,
    ),
  )
  t.true(
    stubs.email.sendRegistrationEmail.calledWith(
      'new@example.com',
      'mock.jwt.token',
      `You have been invited to join ${classData.name} on Time Flow! Register using the following link:`,
    ),
  )
})

test('inviteUsersByEmail skips confirmation for instructor role', async t => {
  const { service, stubs, roles } = t.context
  const existingUser = { id: '123', email: 'existing@example.com' }

  stubs.database.filterRecords.resolves([existingUser])

  await service.inviteUsersByEmail({
    emails: ['existing@example.com'],
    role: roles.INSTRUCTOR, // Use the roles constant directly
  })

  // Add debug assertions
  t.true(
    stubs.email.sendConfirmationEmail.notCalled,
    `Confirmation email was sent when it shouldn't have been. 
     Number of calls: ${stubs.email.sendConfirmationEmail.callCount}
     Call arguments: ${JSON.stringify(stubs.email.sendConfirmationEmail.args)}`,
  )
})
