import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import Button from '../../components/Button/Button'
import Dropdown from '../../components/Dropdown/Dropdown'
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
  const [studentError, setStudentError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [teams, setTeams] = useState({})
  const [newTeamName, setNewTeamName] = useState('')
  const [isTeamSubmitting, setIsTeamSubmitting] = useState(false)
  const [showTeamForm, setShowTeamForm] = useState({})
  const [studentDetails, setStudentDetails] = useState([])
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedTeam, setSelectedTeam] = useState('')

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
        console.log('classDetails.students:', classDetails.students)
        const studentRequests = classDetails.students.map(id =>
          axios.get(`/api/users/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        )
        const responses = await Promise.all(studentRequests)
        const studentData = responses.map(response => response.data)

        setStudentDetails(studentData)
      } catch (error) {
        console.error('Error fetching students:', error)
        setStudentError('No students found.')
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

  const handleStudentChange = event => {
    setSelectedStudent(event.target.value)
  }

  const handleTeamChange = event => {
    setSelectedTeam(event.target.value)
  }

  const handleAddStudentToTeam = () => {
    if (selectedStudent && selectedTeam) {
      // Implement the logic to add the student to the team
      setSelectedStudent('')
      setSelectedTeam('')
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
                          <Dropdown
                            width="250px"
                            content={
                              <div className="p-4">
                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Select Student
                                  </label>
                                  <select
                                    value={selectedStudent}
                                    onChange={handleStudentChange}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                  >
                                    <option value="" disabled>
                                      Select a student
                                    </option>
                                    {studentDetails.map(student => (
                                      <option key={student.id} value={student.id}>
                                        {student.displayName}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Select Team
                                  </label>
                                  <select
                                    value={selectedTeam}
                                    onChange={handleTeamChange}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                  >
                                    <option value="" disabled>
                                      Select a team
                                    </option>
                                    {teams.map(team => (
                                      <option key={team.id} value={team.id}>
                                        {team.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <button
                                  onClick={handleAddStudentToTeam}
                                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  Add Student to Team
                                </button>
                              </div>
                            }
                          >
                            <FontAwesomeIcon className="text-2xl text-primary" icon="user" />
                          </Dropdown>
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
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* Students section */}

          {user.user.role === 'INSTRUCTOR' && (
            <div>
              <hr className="mb-4"></hr>
              <h3 className="text-lg font-bold text-primary">Students</h3>
              {studentError ? (
                <p className="text-red-500">{studentError}</p>
              ) : (
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
              )}
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
