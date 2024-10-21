import { getClassById } from '#services/classesService.js'

export const createClass = (req, res) => {}

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
