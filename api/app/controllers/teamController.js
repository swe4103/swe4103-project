import { getTeamById } from '#services/teamService.js'

export const createTeam = (req, res) => {}

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
