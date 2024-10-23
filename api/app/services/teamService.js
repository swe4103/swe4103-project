import { getRecord } from '#services/DatabaseService.js'

export const getTeamById = async id => await getRecord('Team', id)
