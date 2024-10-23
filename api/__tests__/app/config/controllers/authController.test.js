import test from 'ava'
import bcrypt from 'bcryptjs'
import sinon from 'sinon'

import { changePassword } from '../../app/controllers/authController.js'
import { changePasswordSchema } from '../../app/schemas/changePasswordSchema.js'
import { getUserById, updatePassword } from '../../app/services/usersService.js'

test.beforeEach(t => {
  t.context.req = {
    body: {
      currentPassword: 'OldPassword123!',
      newPassword: 'NewPassword123!',
      confirmPassword: 'NewPassword123!',
    },
    user: {
      id: 'user-id',
    },
  }

  t.context.res = {
    status: sinon.stub().returnsThis(),
    json: sinon.stub().returnsThis(),
  }
})

test.afterEach.always(t => {
  sinon.restore() // Ensure all stubs are restored after each test
})

test('should return 400 if schema validation fails', async t => {
  const { req, res } = t.context
  const validateStub = sinon
    .stub(changePasswordSchema, 'validate')
    .returns({ error: { details: [{ message: 'Validation error' }] } })

  await changePassword(req, res)

  t.true(res.status.calledWith(400))
  t.true(res.json.calledWith({ message: 'Validation error' }))

  validateStub.restore() // Restore stubbed validation after the test
})

test('should return 404 if user is not found', async t => {
  const { req, res } = t.context

  // Simulate user not found
  const getUserStub = sinon.stub(getUserById).resolves(null)

  await changePassword(req, res)

  t.true(res.status.calledWith(404))
  t.true(res.json.calledWith({ message: 'User not found' }))

  getUserStub.restore() // Restore stubbed service after the test
})

test('should return 401 if current password is incorrect', async t => {
  const { req, res } = t.context

  // Simulate user found
  const getUserStub = sinon.stub(getUserById).resolves({ password: 'hashedPassword' })

  // Simulate incorrect password
  const bcryptStub = sinon.stub(bcrypt, 'compare').resolves(false)

  await changePassword(req, res)

  t.true(res.status.calledWith(401))
  t.true(res.json.calledWith({ message: 'Current password is incorrect' }))

  getUserStub.restore() // Restore stubbed services
  bcryptStub.restore()
})

test('should return 200 if password is changed successfully', async t => {
  const { req, res } = t.context

  // Simulate user found
  const getUserStub = sinon.stub(getUserById).resolves({ password: 'hashedPassword' })

  // Simulate correct password comparison
  const bcryptCompareStub = sinon.stub(bcrypt, 'compare').resolves(true)

  // Simulate successful password hashing
  const bcryptHashStub = sinon.stub(bcrypt, 'hash').resolves('newHashedPassword')

  // Simulate successful password update
  const updatePasswordStub = sinon.stub(updatePassword).resolves()

  await changePassword(req, res)

  t.true(res.status.calledWith(200))
  t.true(res.json.calledWith({ message: 'Password changed successfully' }))

  // Restore all stubs
  getUserStub.restore()
  bcryptCompareStub.restore()
  bcryptHashStub.restore()
  updatePasswordStub.restore()
})
