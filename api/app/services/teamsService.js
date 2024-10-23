import { v4 as uuidv4 } from 'uuid'

import { getRecord, deleteRecord, updateRecord, saveRecord } from '#services/DatabaseService.js'

export const createNewTeam = async team => await saveRecord('Team', { id: uuidv4(), ...team })

export const getTeamById = async id => await getRecord('Team', id)

export const deleteTeamById = async id => await deleteRecord('Team', id)

export const updateTeamById = async (id, data) => await updateRecord('Team', id, data)
