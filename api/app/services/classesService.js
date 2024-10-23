import { getRecord } from '#services/DatabaseService.js'

export const getClassByID = async id => await getRecord('Class', id)
