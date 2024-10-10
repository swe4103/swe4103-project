import jwt from 'jsonwebtoken'
import request from 'supertest'

import app from '#app'
import { Roles } from '#constants/roles.js'
import userController from '#controllers/usersController.js'
import { authJWT } from '#middleware/authMiddleware.js'
import usersSchema from '#schemas/usersSchema.js' // assuming your schema is here

jest.mock('jsonwebtoken') // Mock the JWT functions
jest.mock('#schemas/usersSchema.js') // Mock the validation schema

describe('POST /api/users/invite', () => {
  const validToken = 'valid-token'
  const mockUser = { role: Roles.ADMIN } // mock authenticated user

  beforeEach(() => {
    // Mock JWT verification to pass for valid requests
    jwt.verify = jest.fn((token, secret, callback) => callback(null, mockUser))
  })

  it('should return 400 if request validation fails', async () => {
    // Mock the Joi validation to return an error
    usersSchema.invite.validate.mockReturnValue({
      error: { details: [{ message: 'Invalid request body' }] },
    })

    const res = await request(app)
      .post('/api/users/invite')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ emails: [], role: Roles.INSTRUCTOR })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Invalid request body')
  })

  it('should return 403 if inviter is not authorized', async () => {
    const unauthorizedUser = { role: Roles.STUDENT } // mock a student trying to invite
    jwt.verify.mockImplementation((token, secret, callback) => callback(null, unauthorizedUser))

    const res = await request(app)
      .post('/api/users/invite')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        emails: ['student@example.com'],
        role: Roles.INSTRUCTOR,
      })

    expect(res.status).toBe(403)
    expect(res.body.message).toBe('You are not authorized to send this invite')
  })

  it('should send invitations for valid request', async () => {
    // Mock successful validation
    usersSchema.invite.validate.mockReturnValue({ error: null })

    // Mock JWT sign to return a dummy token
    jwt.sign.mockReturnValue('dummy-invite-token')

    const res = await request(app)
      .post('/api/users/invite')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        emails: ['student@example.com', 'teacher@example.com'],
        role: Roles.STUDENT,
        projectId: '123',
      })

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('STUDENT invitations sent successfully.')
  })

  it('should return 500 on internal server error', async () => {
    // Mock successful validation
    usersSchema.invite.validate.mockReturnValue({ error: null })

    // Force an error in invitation sending
    jwt.sign.mockImplementation(() => {
      throw new Error('Internal Error')
    })

    const res = await request(app)
      .post('/api/users/invite')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        emails: ['student@example.com'],
        role: Roles.STUDENT,
        projectId: '123',
      })

    expect(res.status).toBe(500)
    expect(res.body.message).toBe('Internal server error')
  })
})
