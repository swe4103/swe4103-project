import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

import config from '#config'
import Roles from '#constants/roles.js'
import {
  filterRecords,
  listRecords,
  getRecord,
  saveRecord,
  updateRecord,
  upsertRecord,
  deleteRecord,
} from '#services/DatabaseService.js'
import { sendRegistrationEmail, sendConfirmationEmail } from '#services/emailService.js'

export const createUser = async user => await saveRecord('User', { id: uuidv4(), ...user })

export const getUserById = async id => await getRecord('User', id)

export const deleteUserById = async id => await deleteRecord('User', id)

export const updateUserById = async (id, data) => await updateRecord('User', id, data)

export const getUserByEmail = async email => {
  const response = await listRecords('User', 'email', email)
  return response ? response[0] : null
}

export const getUsersByEmails = async emails => {
  const query = {
    query: `SELECT * FROM c WHERE ARRAY_CONTAINS(@emails, c.email)`,
    parameters: [{ name: '@emails', value: emails }],
  }
  return await filterRecords('User', query)
}

export const inviteUsersByEmail = async ({ emails, role, teamId }) => {
  const users = (await getUsersByEmails(emails)) || []

  const existingUsers = users.filter(user => emails.includes(user.email))
  const newUsers = emails.filter(email => !users.some(user => user.email === email))

  let message
  if (teamId) {
    const team = await getRecord('Team', teamId)
    message = `You have been invited to join ${team.name} on Time Flow! Register using the following link:`
  } else {
    message = 'You have been invited to join Time Flow! Register using the following link:'
  }

  const existingPromises = existingUsers.map(async user => {
    if (role !== Roles.INSTRUCTOR) {
      user.groups = [...new Set([...(user.groups || []), teamId])]
      await upsertRecord('User', user)
      await sendConfirmationEmail(email, team.name)
    }
  })

  const newPromises = newUsers.map(async email => {
    const token = jwt.sign(
      { email, role, ...(role === Roles.STUDENT && { teamId }) },
      config.jwtInviteSecret,
      { expiresIn: '1d' },
    )
    await sendRegistrationEmail(email, token, message)
  })
  return Promise.all([...existingPromises, ...newPromises])
}
