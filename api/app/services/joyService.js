import { v4 as uuidv4 } from 'uuid'

import {
  filterRecords,
  getRecord,
  saveRecord,
  updateRecord,
  deleteRecord,
} from '#services/DatabaseService.js'

export const createJoy = async joyRating =>
  await saveRecord('JoyRating', { id: uuidv4(), ...joyRating })

export const getJoyById = async id => await getRecord('JoyRating', id)

export const deleteJoyById = async id => await deleteRecord('JoyRating', id)

export const updateJoyById = async (id, data) => await updateRecord('JoyRating', id, data)

export const listJoys = async ({ userId, teamId, fromDate, toDate }) => {
  if (!userId && !teamId) {
    throw new Error('Either userId or teamId must be provided.')
  }

  const query = `
    SELECT * FROM c 
    WHERE 
      ${userId ? 'c.userId = @userId' : ''}
      ${userId && teamId ? 'AND' : ''}
      ${teamId ? 'c.teamId = @teamId' : ''}
      ${fromDate ? 'AND c.date >= @fromDate' : ''}
      ${toDate ? 'AND c.date <= @toDate' : ''}
  `.trim()

  const parameters = [
    userId && { name: '@userId', value: userId },
    teamId && { name: '@teamId', value: teamId },
    fromDate && { name: '@fromDate', value: fromDate },
    toDate && { name: '@toDate', value: toDate },
  ].filter(Boolean)

  return await filterRecords('JoyRating', { query, parameters })
}

export const listTeamMemberJoys = async ({ teamId, fromDate, toDate }) => {
  if (!teamId) {
    throw new Error('teamId must be provided.')
  }
  console.log('\n\n\n MEMBER JOYS \n\n\n')

  const query = `
    SELECT * FROM c 
    WHERE 
      ${teamId ? 'c.teamId = @teamId' : ''}
      ${fromDate ? 'AND c.date >= @fromDate' : ''}
      ${toDate ? 'AND c.date <= @toDate' : ''}
  `.trim()

  const parameters = [
    teamId && { name: '@teamId', value: teamId },
    fromDate && { name: '@fromDate', value: fromDate },
    toDate && { name: '@toDate', value: toDate },
  ].filter(Boolean)

  return await filterRecords('JoyRating', { query, parameters })
}
