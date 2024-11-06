import { teamSchema, updateTeamSchema, listTeamsQuerySchema } from '#schemas/teams.js'
import {
  getTeamById,
  updateTeamById,
  deleteTeamById,
  createNewTeam,
  listTeamsByProjectId,
} from '#services/teamsService.js'

export const createTeam = async (req, res) => {
  const { error, value } = teamSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  try {
    const team = await createNewTeam(value)
    return res.status(201).json(team)
  } catch (error) {
    console.error('Error creating team: ', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const getTeam = async (req, res) => {
  const { id } = req.params

  try {
    const team = await getTeamById(id)
    if (!team) {
      return res.status(404).json({ message: 'Team not found' })
    }
    return res.status(200).json(team)
  } catch (error) {
    console.error('Error retrieving team: ', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const listTeams = async (req, res) => {
  const { error, value } = listTeamsQuerySchema.validate(req.query, { stripUnknown: true })
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  try {
    const teams = await listTeamsByProjectId(value)
    if (!teams) {
      return res.status(200).json([])
    }
    return res.status(200).json(teams)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const updateTeam = async (req, res) => {
  const { id } = req.params

  const { error, value } = updateTeamSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  try {
    const updatedTeam = await updateTeamById(id, value)
    if (!updatedTeam) {
      return res.status(404).json({ message: 'Team not found' })
    }
    return res.status(200).json(updatedTeam)
  } catch (error) {
    console.error('Error updating team: ', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const deleteTeam = async (req, res) => {
  const { id } = req.params
  try {
    const deletedID = await deleteTeamById(id)
    if (!deletedId) {
      return res.status(404).json({ message: 'Team not found' })
    }

    return res.status(204).send()
  } catch (error) {
    console.error('Error deleting team: ', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
