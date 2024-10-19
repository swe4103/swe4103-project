import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

import config from '#config'
import { Roles } from '#constants/roles.js'
import { filterRecords, getRecord, saveRecord, updateRecord } from '#services/DatabaseService.js'

export const createUser = async user => await saveRecord('User', { id: uuidv4(), ...user })

export const getUserById = async id => await getRecord('User', id)

export const updateUserById = async (id, data) => updateRecord('User', id, data)

export const getUserByEmail = async email => {
  const filterQuery = {
    query: 'SELECT * FROM c WHERE c.email = @email',
    parameters: [
      {
        name: '@email',
        value: email,
      },
    ],
  }
  const response = await filterRecords('User', filterQuery)
  return response[0]
}

export const generateUserInvites = async params => {
  const { emails, role } = params
  const invitations = emails.map(email => {
    const tokenPayload = { email, role }
    if (role === Roles.STUDENT) {
      tokenPayload.teamId = params.teamId
    }

    const token = jwt.sign(tokenPayload, config.jwtInviteSecret, { expiresIn: '3d' })
    // TODO: Send invitation email
    return Promise.resolve() // Placeholder for email sending logic
  })
  return await Promise.all(invitations)
}
