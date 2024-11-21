import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useAuth } from '../../state/AuthProvider/AuthProvider'

const ProjectList = () => {
  const { classId } = useParams()
  const { user } = useAuth()
  const [projectTeams, setProjectTeams] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTeamsAndProjects = async () => {
      try {
        const token = user.token
        const config = { headers: { Authorization: `Bearer ${token}` } }

        // Fetch teams based on student's groups (team IDs)
        const teamResponses = await Promise.all(
          user.user.groups.map(teamId => axios.get(`/api/teams/${teamId}`, config)),
        )
        const fetchedTeams = teamResponses.map(response => response.data)

        // Get project IDs from the fetched teams
        const projectIds = fetchedTeams.map(team => team.projectId)

        // Fetch projects using the project IDs
        const projectResponses = await Promise.all(
          projectIds.map(projectId => axios.get(`/api/projects/${projectId}`, config)),
        )
        const fetchedProjects = projectResponses.map(response => response.data)

        // Filter projects to only include those with the specified classId
        const filteredProjects = fetchedProjects.filter(project => project.classId === classId)
        console.log(projectTeams)
        // Combine projects and teams into an array of JSON objects
        const combinedProjectTeams = filteredProjects.map(project => {
          const team = fetchedTeams.find(team => team.projectId === project.id)
          return { project, team }
        })

        setProjectTeams(combinedProjectTeams)
      } catch (error) {
        console.error('Error fetching teams and projects:', error)
        setError('Failed to fetch teams and projects')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeamsAndProjects()
  }, [classId, user.token, user.user.groups])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-primary">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projectTeams.map(({ project, team }) => (
          <div key={project.id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
            <p className="text-gray-700">{team ? `Team: ${team.name}` : 'No team found'}</p>
            <p className="text-gray-700 mb-4">{`Description: ${project.description}`}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectList
