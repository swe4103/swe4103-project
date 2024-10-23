import test from 'ava'
import bcrypt from 'bcryptjs'
import sinon from 'sinon'

import * as databaseService from '../../app/services/DatabaseService.js'

import * as usersService from '#services/usersService'

// Before each test, reset the context and stubs
test.beforeEach(t => {
  t.context.getUserByIdStub = sinon.stub(usersService, 'getUserById')
  t.context.updatePasswordStub = sinon.stub(usersService, 'updatePassword')
  t.context.bcryptCompareStub = sinon.stub(bcrypt, 'compare')
  t.context.bcryptHashStub = sinon.stub(bcrypt, 'hash')
})

test.afterEach.always(t => {
  sinon.restore()
})

/**
 * Test for successful password change
 */
test('changePassword should successfully change the password when current password is correct', async t => {
  const userId = '123'
  const currentPassword = 'OldPassword123!'
  const newPassword = 'NewPassword123!'
  const hashedNewPassword = 'hashedNewPassword'

  const user = { id: userId, password: 'hashedOldPassword' }

  // Stubs: Simulate database and bcrypt behaviors
  t.context.getUserByIdStub.resolves(user)
  t.context.bcryptCompareStub.resolves(true) // current password matches
  t.context.bcryptHashStub.resolves(hashedNewPassword)

  await usersService.changePassword(userId, currentPassword, newPassword)

  // Expectations: Check if password was correctly updated
  t.true(t.context.getUserByIdStub.calledOnce)
  t.true(t.context.bcryptCompareStub.calledOnce)
  t.true(t.context.bcryptHashStub.calledOnce)
  t.true(t.context.updatePasswordStub.calledOnceWith(userId, hashedNewPassword))
})

/**
 * Test for incorrect current password
 */
test('changePassword should fail if the current password is incorrect', async t => {
  const userId = '123'
  const currentPassword = 'WrongPassword123!'
  const newPassword = 'NewPassword123!'

  const user = { id: userId, password: 'hashedOldPassword' }

  // Stubs: Simulate database and bcrypt behaviors
  t.context.getUserByIdStub.resolves(user)
  t.context.bcryptCompareStub.resolves(false) // current password does not match

  const error = await t.throwsAsync(() =>
    usersService.changePassword(userId, currentPassword, newPassword),
  )

  // Expectations: Ensure appropriate behavior when password is incorrect
  t.true(t.context.getUserByIdStub.calledOnce)
  t.true(t.context.bcryptCompareStub.calledOnce)
  t.is(error.message, 'Current password is incorrect')
  t.false(t.context.bcryptHashStub.called) // Password hashing should not occur
  t.false(t.context.updatePasswordStub.called) // Password update should not occur
})

/**
 * Test for user not found
 */
test('changePassword should fail if the user is not found', async t => {
  const userId = '123'
  const currentPassword = 'OldPassword123!'
  const newPassword = 'NewPassword123!'

  // Stubs: Simulate user not found
  t.context.getUserByIdStub.resolves(null)

  const error = await t.throwsAsync(() =>
    usersService.changePassword(userId, currentPassword, newPassword),
  )

  // Expectations: Ensure appropriate behavior when the user is not found
  t.true(t.context.getUserByIdStub.calledOnce)
  t.is(error.message, 'User not found')
  t.false(t.context.bcryptCompareStub.called) // No password comparison if user is not found
  t.false(t.context.bcryptHashStub.called) // Password hashing should not occur
  t.false(t.context.updatePasswordStub.called) // Password update should not occur
})
