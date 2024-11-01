import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import { useAuth } from '../../state/AuthProvider/AuthProvider'

const ProjectView = () => {
  const { projectId } = useParams()
  const { user } = useAuth()
  const [projectDetails, setProjectDetails] = useState(null)
  const [teams, setTeams] = useState([])
  const [newTeamName, setNewTeamName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTeamForm, setShowTeamForm] = useState(false)
  const [showDeleteInput, setShowDeleteInput] = useState(false)
  const [selectedTeamId, setSelectedTeamId] = useState('')

  useEffect(() => {
    const fetchProjectDetailsAndTeams = async () => {
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
        const projectResponse = await axios.get(
          `http://localhost:3000/api/projects/${projectId}`,
          config,
        )
        setProjectDetails(projectResponse.data || null)

        const teamResponse = await axios.get(`http://localhost:3000/api/teams`, {
          ...config,
          params: { projectId },
        })
        setTeams(teamResponse.data || [])
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to fetch project details or teams')
      }
      setIsLoading(false)
    }
    fetchProjectDetailsAndTeams()
  }, [projectId, user])

  const handleAddTeam = async e => {
    e.preventDefault()
    if (!user || !user.token) {
      setError('User not authenticated')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await axios.post(
        'http://localhost:3000/api/teams',
        { name: newTeamName, projectId },
        { headers: { Authorization: `Bearer ${user.token}` } },
      )
      setTeams(prev => [...prev, response.data])
      setNewTeamName('')
      setShowTeamForm(false)
    } catch (error) {
      console.error('Error adding team:', error)
      setError('Failed to add team')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTeam = async () => {
    if (!selectedTeamId) return

    const confirmDelete = window.confirm('Are you sure you want to delete this team?')
    if (!confirmDelete) return

    try {
      await axios.delete(`http://localhost:3000/api/teams/${selectedTeamId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      setTeams(teams.filter(team => team.id !== selectedTeamId))
      setSelectedTeamId('') // Reset selection
      setShowDeleteInput(false) // Hide dropdown
    } catch (error) {
      console.error('Error deleting team:', error)
      setError('Failed to delete team')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {projectDetails ? (
        <div className="w-full h-full flex flex-col">
          <h3 className="text-lg font-bold pb-4">{projectDetails.name}</h3>
          <label className="bg-gray-300 p-1 border rounded m-1 text-white">
            {projectDetails.year}
          </label>
          {user.user.role === 'INSTRUCTOR' && (
            <div className="flex gap-4 mb-4">
              <Button onClick={() => setShowTeamForm(!showTeamForm)}>
                {showTeamForm ? 'Cancel' : 'Add Team'}
              </Button>
              <Button
                onClick={() => setShowDeleteInput(!showDeleteInput)}
                className="bg-red-500 text-white"
              >
                {showDeleteInput ? 'Cancel Delete' : 'Delete Team'}
              </Button>
            </div>
          )}
          {showTeamForm && (
            <form onSubmit={handleAddTeam} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Team Name"
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
                required
                className="p-2 border rounded"
              />
              <Button type="submit" disabled={isSubmitting}>
                Submit Team
              </Button>
            </form>
          )}
          {showDeleteInput && (
            <div className="flex flex-col gap-4">
              <select
                value={selectedTeamId}
                onChange={e => setSelectedTeamId(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">Select Team to Delete</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              <Button onClick={handleDeleteTeam} className="bg-red-500 text-white">
                Confirm Delete
              </Button>
            </div>
          )}
          <h2>Teams:</h2>
          {teams.length > 0 && (
            <Card className="flex flex-col items-center justify-center w-full p-6 h-full gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {teams.map(team => (
                  <div
                    key={team.id}
                    className="flex flex-col gap-3 bg-white border p-4 rounded-md hover:shadow"
                  >
                    <p className="text-md font-bold">{team.name}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      ) : (
        <p>Project not found.</p>
      )}
    </div>
  )
}

export default ProjectView
