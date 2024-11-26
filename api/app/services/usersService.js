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

export const inviteUsersByEmail = async ({ emails, role, classId }) => {
  const users = (await getUsersByEmails(emails)) || []
  console.log('emails:', emails)
  const existingUsers = users.filter(user => emails.includes(user.email))
  const newUsers = emails.filter(email => !users.some(user => user.email === email))

  let message
  let className
  if (classId) {
    const clazz = await getRecord('Class', classId)
    const existingUserIds = [existingUsers.map(user => user.id)]
    clazz.students = [...new Set([...(clazz.students || []), ...existingUserIds])]
    await upsertRecord('Class', clazz)
    message = `You have been invited to join ${clazz.name} on Time Flow! Register using the following link:`
  } else {
    message = 'You have been invited to join Time Flow! Register using the following link:'
  }

  const existingPromises = existingUsers.map(async user => {
    if (role !== Roles.INSTRUCTOR) {
      await sendConfirmationEmail(user.email, message)
    }
  })

  const newPromises = newUsers.map(async email => {
    const token = jwt.sign(
      { email, role, ...(role === Roles.STUDENT && { classId }) },
      config.jwtInviteSecret,
      { expiresIn: '1d' },
    )
    await sendRegistrationEmail(email, token, message)
  })

  return Promise.all([...existingPromises, ...newPromises])
}
