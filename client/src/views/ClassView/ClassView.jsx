import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import { useAuth } from '../../state/AuthProvider/AuthProvider'

const ClassView = () => {
  const { classId } = useParams()
  const { user } = useAuth()
  const [classDetails, setClassDetails] = useState(null)
  const [projects, setProjects] = useState([])
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showDeleteInput, setShowDeleteInput] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState('')

  useEffect(() => {
    const fetchClassDetailsAndProjects = async () => {
      if (!user || !user.token) {
        setError('User not authenticated')
        setIsLoading(false)
        return
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      setIsLoading(true)
      try {
        const classResponse = await axios.get(
          `http://localhost:3000/api/classes/${classId}`,
          config,
        )
        setClassDetails(classResponse.data || null)

        const projectResponse = await axios.get(`http://localhost:3000/api/projects`, {
          ...config,
          params: { classId },
        })
        setProjects(projectResponse.data || [])
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to fetch class details or projects')
      }
      setIsLoading(false)
    }
    fetchClassDetailsAndProjects()
  }, [classId, user])
  const handleAddProject = async e => {
    e.preventDefault()
    if (!user || !user.token) {
      setError('User not authenticated')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await axios.post(
        'http://localhost:3000/api/projects',
        { name: newProjectName, classId, description: newProjectDescription },
        { headers: { Authorization: `Bearer ${user.token}` } },
      )
      setProjects(prev => [...prev, response.data])
      setNewProjectName('')
      setNewProjectDescription('')
      setShowProjectForm(false)
    } catch (error) {
      console.error('Error adding project:', error)
      setError('Failed to add project')
    } finally {
      setIsSubmitting(false)
    }
  }
  const handleDeleteProject = async () => {
    if (!selectedProjectId) return

    const confirmDelete = window.confirm('Are you sure you want to delete this project?')
    if (!confirmDelete) return

    try {
      await axios.delete(`http://localhost:3000/api/projects/${selectedProjectId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      setProjects(projects.filter(project => project.id !== selectedProjectId))
      setSelectedProjectId('') // Reset selection
      setShowDeleteInput(false) // Hide dropdown
    } catch (error) {
      console.error('Error deleting project:', error)
      setError('Failed to delete project')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {classDetails ? (
        <div className="w-full h-full flex flex-col">
          <h3 className="pb-4 m-1">
            <label className="text-lg font-bold me-2">{classDetails.name}</label>
            <label className="bg-gray-300 p-1 border rounded m-1 text-white">
              {classDetails.year}
            </label>
          </h3>
          <hr className="mb-2"></hr>

          <h3 className="text-lg font-bold pb-4">Projects:</h3>
          {projects.length > 0 && (
            <Card className="flex flex-col items-center justify-center w-full p-6 h-full gap-4 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {projects.map(p => (
                  <Link
                    to={`/team-list/${p.id}`}
                    key={p.id}
                    className="flex flex-col gap-3 bg-white border p-4 rounded-md hover:shadow"
                  >
                    <div
                      key={p.id}
                      className="flex flex-col gap-3 bg-white border p-4 rounded-md hover:shadow"
                    >
                      <p className="text-md font-bold">{p.name}</p>
                      <p className="text-sm text-gray-500">{p.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}
          {user.user.role === 'INSTRUCTOR' && (
            <div className="flex gap-4 mb-4">
              <Button onClick={() => setShowProjectForm(!showProjectForm)}>
                {showProjectForm ? 'Cancel' : 'Add Project'}
              </Button>
              <Button
                onClick={() => setShowDeleteInput(!showDeleteInput)}
                className="bg-red-500 text-white"
              >
                {showDeleteInput ? 'Cancel Delete' : 'Delete Project'}
              </Button>
            </div>
          )}
          {showProjectForm && (
            <form onSubmit={handleAddProject} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Project Name"
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                required
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Project Description"
                value={newProjectDescription}
                onChange={e => setNewProjectDescription(e.target.value)}
                className="p-2 border rounded"
              />
              <Button type="submit" disabled={isSubmitting}>
                Submit Project
              </Button>
            </form>
          )}
          {showDeleteInput && (
            <div className="flex flex-col gap-4">
              <select
                value={selectedProjectId}
                onChange={e => setSelectedProjectId(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">Select Project to Delete</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <Button onClick={handleDeleteProject} className="bg-red-500 text-white">
                Confirm Delete
              </Button>
            </div>
          )}
        </div>
      ) : (
        <p>Class not found.</p>
      )}
    </div>
  )
}

export default ClassView
