import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import { useAuth } from '../../state/AuthProvider/AuthProvider'

const ClassView = () => {
  const { classId } = useParams()
  const { user } = useAuth()
  const [classDetails, setClassDetails] = useState(null)
  const [projects, setProjects] = useState([])
  const [newProjectName, setNewProjectName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
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
        if (classResponse.data) {
          setClassDetails(classResponse.data)
        } else {
          setError('No data found for class')
        }

        // Attempt to fetch projects associated with this class
        try {
          const projectResponse = await axios.get(`http://localhost:3000/api/projects`, {
            ...config,
            params: { classId },
          })
          setProjects(projectResponse.data || [])
        } catch (projectError) {
          if (projectError.response && projectError.response.status === 404) {
            setProjects([]) // Handle no projects found without setting an error
          } else {
            throw projectError // Re-throw if not a 404 error
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to fetch class details or projects')
      }
      setIsLoading(false)
    }

    fetchData()
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
        {
          name: newProjectName,
          classId: classId,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      setProjects(prevProjects => [...prevProjects, response.data])
      setNewProjectName('')
      setShowProjectForm(false)
    } catch (err) {
      console.error('Error adding project:', err)
      setError('Failed to add project')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {classDetails ? (
        <div className="w-full h-full flex flex-col">
          <h3 className="text-lg font-bold pb-4">{classDetails.name}</h3>
          {user.user.role === 'INSTRUCTOR' && (
            <div className="flex gap-4 mb-4">
              <Button onClick={() => setShowProjectForm(!showProjectForm)}>
                {showProjectForm ? 'Cancel' : 'Add Project'}
              </Button>
            </div>
          )}
          <p>Year: {classDetails.year}</p>
          <h2>Projects:</h2>
          <Card className="flex flex-col items-center justify-center w-full p-6 h-full gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {projects.length > 0 ? (
                projects.map(project => (
                  <Link
                    to={`/projects/${project.id}`}
                    key={project.id}
                    className="flex flex-col gap-3 bg-white border p-4 rounded-md hover:shadow"
                  >
                    <h2 className="text-md font-bold">{project.name}</h2>
                    <p className="text-sm text-gray-500">Details here...</p>
                  </Link>
                ))
              ) : (
                <p>No projects found.</p>
              )}
            </div>
          </Card>
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
              <Button type="submit" disabled={isSubmitting}>
                Submit Project
              </Button>
            </form>
          )}
        </div>
      ) : (
        <p>Class not found.</p>
      )}
    </div>
  )
}

export default ClassView
