import { getRecord, deleteRecord, updateRecord } from '#services/DatabaseService.js'

export const createNewTeam = async team => await saveRecord('Team', { id: uuidv4(), ...team })

export const getTeamById = async id => await getRecord('Team', id)

export const deleteTeamById = async id => deleteRecord('Team', id)

export const updateTeamById = async (id, data) => updateRecord('Team', id, data)
