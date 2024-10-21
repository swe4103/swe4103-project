import { getRecord } from '#services/DatabaseService.js'

export const getClassById = async id => await getRecord('Class', id)
