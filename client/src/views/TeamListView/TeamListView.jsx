import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useAuth } from '../../state/AuthProvider/AuthProvider'

const TeamListView = () => {
  const { classId } = useParams()
  const { user } = useAuth()
  const [classDetails, setClassDetails] = useState(null)
  const [projects, setProjects] = useState([])
  const [teams, setTeams] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

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
  }, [classId, user.token])

  useEffect(() => {
    const fetchTeams = async () => {
      if (!projects || projects.length === 0) {
        return
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      try {
        const teamRequests = projects.map(project =>
          axios.get(`/api/teams`, {
            ...config,
            params: { projectId: project.id },
          }),
        )
        const responses = await Promise.all(teamRequests)
        const teamsData = responses.flatMap((response, index) =>
          response.data.map(team => ({
            ...team,
            projectName: projects[index].name,
            projectDescription: projects[index].description,
          })),
        )
        setTeams(teamsData)
      } catch (error) {
        console.error('Error fetching teams:', error)
        setError('Failed to fetch teams')
      }
    }

    fetchTeams()
  }, [projects, user.token])

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
          <h3 className="text-lg font-bold text-primary">Projects and Teams</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team Name
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teams.map(team => (
                <tr key={team.id} className="bg-white">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {team.projectName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {team.projectDescription}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">Class not found.</p>
      )}
    </div>
  )
}

export default TeamListView
