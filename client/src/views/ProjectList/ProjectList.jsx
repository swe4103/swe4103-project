import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'


import TeamJoyTrend from '../../components/StudentJoyChart/TeamJoyTrend'
import { useAuth } from '../../state/AuthProvider/AuthProvider'

const ProjectList = () => {
  const { classId } = useParams()
  const { user } = useAuth()
  const [projectTeams, setProjectTeams] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasGroups, setHasGroups] = useState(true)
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
    if (user.user.groups.length > 0) {
      setHasGroups(false);
    }
    if (hasGroups) {
      fetchTeamsAndProjects()
    } else {
      setIsLoading(false)
    }

  }, [classId, user.token, user.user.groups, hasGroups])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  if (hasGroups) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-primary">Projects</h1>
        <div className="grid grid-cols-1 gap-4">
          {projectTeams.map(({ project, team }) => (
            <div key={project.id} className="bg-white shadow-md rounded-lg p-4">
              <div className="flex flex-row items-start">
                {/* Left Side: Name and Description */}
                <Link
                  to={`/team/${team.id}`}
                  key={team.id}
                  className="w-full h-auto bg-white border p-4 rounded-md hover:shadow-md transition duration-200 flex"
                >
                  {/* Left Side: Project and Team Info */}
                  <div className="w-1/2 flex flex-col">
                    <h2 className="font-semibold mb-2">
                      <label className="text-xl font-bold text-primary">{project.name}</label>
                    </h2>
                    <p>
                      <label className="text-md font-semibold">Team:</label> {team.name}
                    </p>
                    <label className="text-gray-500 p-2">{project.description}</label>
                  </div>

                  {/* Right Side: Chart */}
                  <div className="w-1/2 flex items-center justify-center">
                    <div className="w-full">
                      <TeamJoyTrend />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  } else {
    return <h3>No projects or teams found in this class</h3>
  }
}

export default ProjectList
