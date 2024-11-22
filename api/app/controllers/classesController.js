import { updateClassSchema, classSchema, listClassesQuerySchema } from '#schemas/classes.js'
import {
  getClassById,
  updateClassById,
  deleteClassById,
  createNewClass,
  listClassesByIds,
  listClassesByStudentId,
} from '#services/classesService.js'
import { updateUserById } from '#services/usersService.js'

export const createClass = async (req, res) => {
  const { error, value } = classSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  try {
    const clazz = await createNewClass(value)
    return res.status(201).json(clazz)
  } catch (error) {
    console.error('Error creating class: ', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
export const listStudentClasses = async (req, res) => {
  console.log('req', req.user)
  const { error, value } = listClassesQuerySchema.validate(req.query, { stripUnknown: true })
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  try {
    const classes = await listClassesByStudentId(value)
    if (!classes) {
      return res.status(404).json({ message: 'No classes found' })
    }
    return res.status(200).json(classes)
  } catch (error) {
    console.error('Error fetching classes:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
export const listClasses = async (req, res) => {
  console.log('hi 1')

  if (req.user.role == 'STUDENT') {
    try {
      console.log('hi 2')
      const classes = await listClassesByStudentId(req.user.id)
      if (!classes) {
        return res.status(404).json({ message: 'No classes found' })
      }
      return res.status(200).json(classes)
    } catch (error) {
      console.error('Error fetching classes:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
  try {
    const { error, value } = listClassesQuerySchema.validate(req.query, { stripUnknown: true })
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }
    const classes = await listClassesByIds(value)
    if (!classes) {
      return res.status(404).json({ message: 'No classes found' })
    }
    return res.status(200).json(classes)
  } catch (error) {
    console.error('Error fetching classes:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const getClass = async (req, res) => {
  const { id } = req.params

  try {
    const clazz = await getClassById(id)
    if (!clazz) {
      return res.status(404).json({ message: 'Class not found' })
    }
    return res.status(200).json(clazz)
  } catch (error) {
    console.error('Error retrieving class: ', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const updateClass = async (req, res) => {
  const { id } = req.params

  const { error, value } = updateUserSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  try {
    const updatedClass = await updateClassById(id, value)
    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' })
    }
    return res.status(200).json(updatedClass)
  } catch (error) {
    console.error('Error updating class: ', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const deleteClass = async (req, res) => {
  const { id } = req.params
  try {
    const deletedID = await deleteClassById(id)
    if (!deletedId) {
      return res.status(404).json({ message: 'Class not found' })
    }

    return res.status(204).send()
  } catch (error) {
    console.error('Error deleting class: ', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
