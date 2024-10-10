import { filterRecords } from '#services/DatabaseService.js'

// Get a user record by email using the generic filter function
export const getUserByEmail = async email => {
  const filterQuery = {
    query: 'SELECT * FROM c WHERE c.email = @email',
    parameters: [
      {
        name: '@email',
        value: email,
      },
    ],
  }

  const results = await filterRecords('User', filterQuery)
  return results ? results[0] : null
}
