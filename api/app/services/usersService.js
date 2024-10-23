import bcrypt from 'bcryptjs'
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

export const createUser = async user => await saveRecord('User', { id: uuidv4(), ...user })

export const getUserById = async id => await getRecord('User', id)

export const deleteUserById = async id => deleteRecord('User', id)

export const updateUserById = async (id, data) => updateRecord('User', id, data)

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

  const existingPromises = existingUsers.map(async user => {
    if (role !== Roles.INSTRUCTOR) {
      user.groups = [...new Set([...(user.groups || []), teamId])]
      await upsertRecord('User', user)
      // TODO: Send informational email
    }
  })

  const newPromises = newUsers.map(async email => {
    const token = jwt.sign(
      { email, role, ...(role === Roles.STUDENT && { teamId }) },
      config.jwtInviteSecret,
      { expiresIn: '1d' },
    )
    // TODO: Send invitation email with token
  })
  return Promise.all([...existingPromises, ...newPromises])
}

export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await getUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect')
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    await updateRecord('User', userId, { password: hashedNewPassword })

    return { message: 'Password changed successfully' }
  } catch (error) {
    throw new Error('Error changing password: ' + error.message)
  }
}

export const updatePassword = async (userId, hashedPassword) =>
  await updateRecord('User', userId, { password: hashedPassword })
