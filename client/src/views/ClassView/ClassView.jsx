import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import Button from '../../components/Button/Button'
import { useAuth } from '../../state/AuthProvider/AuthProvider'

const ClassView = () => {
  const { classId } = useParams()
  const { user } = useAuth()
  const [classDetails, setClassDetails] = useState(null)
  const [projects, setProjects] = useState([])
  const [expandedProjectIds, setExpandedProjectIds] = useState([]) // Changed to an array to hold multiple expanded project IDs
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [teams, setTeams] = useState({})
  const [newTeamName, setNewTeamName] = useState('')
  const [isTeamSubmitting, setIsTeamSubmitting] = useState(false)
  const [showTeamForm, setShowTeamForm] = useState({})
  const [showTeamDeleteInput, setShowTeamDeleteInput] = useState({})
  const [selectedTeamId, setSelectedTeamId] = useState('')
  const [studentDetails, setStudentDetails] = useState([])

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
        const classResponse = await axios.get(`/api/classes/${classId}`, config)
        setClassDetails(classResponse.data || null)
        const projectResponse = await axios.get(`/api/projects`, {
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
  useEffect(() => {
    const fetchStudents = async () => {
      if (!classDetails || !classDetails.students || classDetails.students.length === 0) {
        return
      }
      try {
        const studentRequests = classDetails.students.map(id =>
          axios.get(`/api/users/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        )
        const responses = await Promise.all(studentRequests)
        let studentData = responses.map(response => response.data)

        // Add test students
        const testStudents = [
          { id: 'test1', displayName: 'Test Student 1', email: 'test1@example.com' },
          { id: 'test2', displayName: 'Test Student 2', email: 'test2@example.com' },
        ]
        studentData = [...studentData, ...testStudents]

        setStudentDetails(studentData)
      } catch (error) {
        console.error('Error fetching students:', error)
        setError('Failed to fetch students')
      }
    }

    fetchStudents()
  }, [classDetails, user])

  const handleAddProject = async e => {
    e.preventDefault()
    if (!user || !user.token) {
      setError('User not authenticated')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await axios.post(
        '/api/projects',
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

  const handleDeleteProject = async projectId => {
    const confirmDelete = window.confirm('Are you sure you want to delete this project?')
    if (!confirmDelete) return

    try {
      await axios.delete(`/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      setProjects(projects.filter(project => project.id !== projectId))
    } catch (error) {
      console.error('Error deleting project:', error)
      setError('Failed to delete project')
    }
  }

  const handleToggleProject = async projectId => {
    setExpandedProjectIds(prev =>
      prev.includes(projectId) ? prev.filter(id => id !== projectId) : [...prev, projectId],
    )
    if (!expandedProjectIds.includes(projectId)) {
      await fetchTeams(projectId)
    }
  }

  const fetchTeams = async projectId => {
    if (!user || !user.token) {
      setError('User not authenticated')
      return
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }

    try {
      const teamResponse = await axios.get(`/api/teams`, {
        ...config,
        params: { projectId },
      })
      setTeams(prev => ({ ...prev, [projectId]: teamResponse.data || [] }))
    } catch (error) {
      console.error('Error fetching teams:', error)
      setError('Failed to fetch teams')
    }
  }

  const handleAddTeam = async (e, projectId) => {
    e.preventDefault()
    if (!user || !user.token) {
      setError('User not authenticated')
      return
    }

    setIsTeamSubmitting(true)
    try {
      const response = await axios.post(
        '/api/teams',
        { name: newTeamName, projectId },
        { headers: { Authorization: `Bearer ${user.token}` } },
      )
      setTeams(prev => ({
        ...prev,
        [projectId]: [...prev[projectId], response.data],
      }))
      setNewTeamName('')
      setShowTeamForm(prev => ({ ...prev, [projectId]: false }))
    } catch (error) {
      console.error('Error adding team:', error)
      setError('Failed to add team')
    } finally {
      setIsTeamSubmitting(false)
    }
  }

  const handleDeleteTeam = async projectId => {
    if (!selectedTeamId) return

    const confirmDelete = window.confirm('Are you sure you want to delete this team?')
    if (!confirmDelete) return

    try {
      await axios.delete(`/api/teams/${selectedTeamId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      setTeams(prev => ({
        ...prev,
        [projectId]: prev[projectId].filter(team => team.id !== selectedTeamId),
      }))
      setSelectedTeamId('') // Reset selection
      setShowTeamDeleteInput(prev => ({ ...prev, [projectId]: false })) // Hide dropdown
    } catch (error) {
      console.error('Error deleting team:', error)
      setError('Failed to delete team')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {classDetails ? (
        <div className="w-full h-full flex flex-col">
          <h2 className="pb-4 m-2 flex justify-between items-center">
            <label className="text-xl font-bold text-primary">{classDetails.name}</label>
            <label className="bg-primary px-4 py-1 border rounded-full m-1 text-white">
              {classDetails.year}
            </label>
          </h2>
          <hr className="mb-4"></hr>
          <h3 className="pb-4 m-2 flex justify-between items-center">
            <label className="text-xl font-bold text-primary">Projects</label>
            {user.user.role === 'INSTRUCTOR' && !showProjectForm && (
              <div className="flex gap-4 mb-4">
                <Button
                  onClick={() => setShowProjectForm(!showProjectForm)}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                >
                  {showProjectForm ? 'Cancel' : 'Create Project'}
                </Button>
              </div>
            )}
          </h3>
          {showProjectForm && (
            <form
              onSubmit={handleAddProject}
              className="flex flex-col gap-4 mt-0 border rounded p-4 mb-4"
            >
              <label className="font-semibold">New Project for {classDetails.name}</label>

              <input
                type="text"
                placeholder="Project Name"
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                required
                className="p-3 border rounded-md"
              />
              <input
                type="text"
                placeholder="Project Description"
                value={newProjectDescription}
                onChange={e => setNewProjectDescription(e.target.value)}
                className="p-3 border rounded-md"
              />
              <div className="flex gap-4 items-center justify-between">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition mb-2"
                >
                  Submit Project
                </Button>
                <Button
                  onClick={() => setShowProjectForm(!showProjectForm)}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                >
                  {showProjectForm ? 'Cancel' : 'Create Project'}
                </Button>
              </div>
            </form>
          )}

          {projects.length > 0 && (
            <div className="w-full">
              {projects.map(p => (
                <div
                  key={p.id}
                  className="mb-6 border rounded-lg shadow-sm hover:shadow-lg transition duration-300"
                >
                  <div
                    className="flex justify-between items-center p-4 bg-primary text-white cursor-pointer rounded-t-lg"
                    onClick={() => handleToggleProject(p.id)}
                  >
                    <div className="flex justify-between items-center">
                      <p>{expandedProjectIds.includes(p.id) ? '▲' : '▼'}</p>{' '}
                      <p className="font-semibold ml-2">{p.name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={e => {
                          e.stopPropagation()
                          handleDeleteProject(p.id)
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                      >
                        <FontAwesomeIcon icon="trash-can" />
                      </Button>
                    </div>
                  </div>
                  {expandedProjectIds.includes(p.id) && (
                    <div className="p-6 bg-white rounded-b-lg">
                      {!p.isEditingDescription ? (
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-700 mb-4 hover:border-primary">
                            {p.description}
                          </p>
                          <Button
                            onClick={() => {
                              const updatedProjects = projects.map(project =>
                                project.id === p.id
                                  ? { ...project, isEditingDescription: true }
                                  : project,
                              )
                              setProjects(updatedProjects)
                            }}
                            className="bg-white text-primary px-2 py-1 hover:bg-white transition"
                          >
                            <FontAwesomeIcon
                              className="text-primary hover:text-accent"
                              icon="pen-to-square"
                            />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 flex-grow">
                          <textarea
                            value={p.description}
                            onChange={e => {
                              const updatedProjects = projects.map(project =>
                                project.id === p.id
                                  ? { ...project, description: e.target.value }
                                  : project,
                              )
                              setProjects(updatedProjects)
                            }}
                            className="p-3 border rounded-md w-full resize-none break-words flex-grow"
                            style={{ height: '200px' }}
                            rows="3"
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={async () => {
                                try {
                                  await axios.put(
                                    `/api/projects/${p.id}`,
                                    { description: p.description },
                                    { headers: { Authorization: `Bearer ${user.token}` } },
                                  )
                                  const updatedProjects = projects.map(project =>
                                    project.id === p.id
                                      ? { ...project, isEditingDescription: false }
                                      : project,
                                  )
                                  setProjects(updatedProjects)
                                } catch (error) {
                                  console.error('Error updating project description:', error)
                                  setError('Failed to update project description')
                                }
                              }}
                              className="bg-green-500 text-white rounded hover:bg-green-600 transition"
                            >
                              ✔
                            </Button>
                            <Button
                              onClick={() => {
                                const updatedProjects = projects.map(project =>
                                  project.id === p.id
                                    ? { ...project, isEditingDescription: false }
                                    : project,
                                )
                                setProjects(updatedProjects)
                              }}
                              className="bg-red-500 text-white rounded hover:bg-red-600 transition"
                            >
                              X
                            </Button>
                          </div>
                        </div>
                      )}

                      <h3 className="text-lg font-bold mt-6">Teams:</h3>
                      {teams[p.id] && teams[p.id].length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4">
                          {teams[p.id].map(team => (
                            <Link
                              to={`/team/${team.id}`}
                              key={team.id}
                              className="flex flex-col gap-3 bg-white border p-4 rounded-md hover:shadow-md transition duration-200"
                            >
                              <p className="text-md font-bold text-primary">{team.name}</p>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 mt-4">No teams found.</p>
                      )}
                      {user.user.role === 'INSTRUCTOR' && (
                        <div className="flex gap-4 mt-6">
                          <Button
                            onClick={() =>
                              setShowTeamForm(prev => ({ ...prev, [p.id]: !prev[p.id] }))
                            }
                            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                          >
                            {showTeamForm[p.id] ? 'Cancel' : 'Add Team'}
                          </Button>
                          <Button
                            onClick={() =>
                              setShowTeamDeleteInput(prev => ({ ...prev, [p.id]: !prev[p.id] }))
                            }
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                          >
                            {showTeamDeleteInput[p.id] ? 'Cancel Delete' : 'Delete Team'}
                          </Button>
                        </div>
                      )}
                      {showTeamForm[p.id] && (
                        <form
                          onSubmit={e => handleAddTeam(e, p.id)}
                          className="flex flex-col gap-4 mt-4"
                        >
                          <input
                            type="text"
                            placeholder="Team Name"
                            value={newTeamName}
                            onChange={e => setNewTeamName(e.target.value)}
                            required
                            className="p-3 border rounded-md"
                          />
                          <Button
                            type="submit"
                            disabled={isTeamSubmitting}
                            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
                          >
                            Submit Team
                          </Button>
                        </form>
                      )}
                      {showTeamDeleteInput[p.id] && (
                        <div className="flex flex-col gap-4 mt-4">
                          <select
                            value={selectedTeamId}
                            onChange={e => setSelectedTeamId(e.target.value)}
                            className="p-3 border rounded-md"
                          >
                            <option value="">Select Team to Delete</option>
                            {teams[p.id].map(team => (
                              <option key={team.id} value={team.id}>
                                {team.name}
                              </option>
                            ))}
                          </select>
                          <Button
                            onClick={() => handleDeleteTeam(p.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                          >
                            Confirm Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* Students section */}
          {user.user.role == 'INSTRUCTOR' && (
            <div>
              <h3 className="text-lg font-bold text-primary">Students</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentDetails.map((student, index) => (
                    <tr key={student.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.displayName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500">Class not found.</p>
      )}
    </div>
  )
}

export default ClassView
