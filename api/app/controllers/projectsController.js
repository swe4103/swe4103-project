import { updateProjectSchema, projectSchema, listProjectsQuerySchema } from '#schemas/projects.js'
import {
  getProjectById,
  updateProjectById,
  deleteProjectById,
  createNewProject,
  listProjectsByClassId,
} from '#services/projectsService.js'

export const createProject = async (req, res) => {
  const { error, value } = projectSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  try {
    const project = await createNewProject(value)
    return res.status(201).json(project)
  } catch (error) {
    console.error('Error creating project: ', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const listProjects = async (req, res) => {
  const { error, value } = listProjectsQuerySchema.validate(req.query, { stripUnknown: true })
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  try {
    const projects = await listProjectsByClassId(value)
    if (!projects) {
      return res.status(404).json({ message: 'No classes found' })
    }
    return res.status(200).json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const getProject = async (req, res) => {
  const { id } = req.params

  try {
    const project = await getProjectById(id)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }
    return res.status(200).json(project)
  } catch (error) {
    console.error('Error retrieving project: ', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const updateProject = async (req, res) => {
  const { id } = req.params

  const { error, value } = updateProjectSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  try {
    const updatedProject = await updateProjectById(id, value)
    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' })
    }
    return res.status(200).json(updatedProject)
  } catch (error) {
    console.error('Error updating project: ', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const deleteProject = async (req, res) => {
  const { id } = req.params
  try {
    const deletedID = await deleteProjectById(id)
    if (!deletedId) {
      return res.status(404).json({ message: 'Project not found' })
    }

    return res.status(204).send()
  } catch (error) {
    console.error('Error deleting project: ', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
