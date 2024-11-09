import { v4 as uuidv4 } from 'uuid'

import {
  getRecord,
  deleteRecord,
  updateRecord,
  saveRecord,
  filterRecords,
} from '#services/DatabaseService.js'

export const createNewTeam = async team => await saveRecord('Team', { id: uuidv4(), ...team })

export const getTeamById = async id => await getRecord('Team', id)

export const deleteTeamById = async id => await deleteRecord('Team', id)

export const updateTeamById = async (id, data) => await updateRecord('Team', id, data)

export const listTeamsByProjectId = async ({ projectId }) => {
  if (!projectId) {
    throw new Error('projectId must be provided.')
  }

  const query = `
    SELECT * FROM c 
    WHERE c.projectId = @projectId
  `.trim()

  const parameters = [{ name: '@projectId', value: projectId }]

  return await filterRecords('Team', { query, parameters })
}
