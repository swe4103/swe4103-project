import { joyRatingSchema, updateJoyRatingSchema, joyRatingsQuerySchema } from '#schemas/joy.js'
import {
  createJoy,
  getJoyById,
  updateJoyById,
  deleteJoyById,
  listJoys,
  listTeamMemberJoys,
} from '#services/joyService.js'

export const listJoyRatings = async (req, res) => {
  const { error, value } = joyRatingsQuerySchema.validate(req.query, { stripUnknown: true })
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }
  try {
    let joyRatings
    if (req.params.listMembers && req.params.listMembers === 'true') {
      joyRatings = await listTeamMemberJoys(value)
    } else {
      joyRatings = await listJoys(value)
    }
    if (!joyRatings) {
      return []
    }
    return res.status(200).json(joyRatings)
  } catch (error) {
    console.error('Error fetching joy ratings:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const getJoyRating = async (req, res) => {
  const { id } = req.params
  try {
    const joyRating = await getJoyById(id)
    if (!joyRating) {
      return res.status(404).json({ message: 'Joy rating not found' })
    }
    return res.status(200).json(joyRating)
  } catch (error) {
    console.error('Error retrieving joy rating: ', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const createJoyRating = async (req, res) => {
  const { error, value } = joyRatingSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  try {
    const joyRating = await createJoy(value)
    return res.status(201).json(joyRating)
  } catch (error) {
    console.error('Error creating joy rating: ', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const updateJoyRating = async (req, res) => {
  const { id } = req.params

  const { error, value } = updateJoyRatingSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  try {
    const updateJoyRating = await updateJoyById(id, value)
    if (!updateJoyRating) {
      return res.status(404).json({ message: 'Joy rating not found' })
    }
    return res.status(200).json(updateJoyRating)
  } catch (error) {
    console.error('Error updating joy rating: ', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const deleteJoyRating = async (req, res) => {
  const { id } = req.params
  try {
    const deletedId = await deleteJoyById(id)
    if (!deletedId) {
      return res.status(404).json({ message: 'Joy rating not found' })
    }

    return res.status(204).send()
  } catch (error) {
    console.error('Error deleting joy rating: ', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
