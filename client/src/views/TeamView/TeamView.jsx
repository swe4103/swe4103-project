import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import AggregateJoyRatingsChart from '../../components/StudentJoyChart/AggregateStudentJoyChart'
import IndividualStudentJoyChart from '../../components/StudentJoyChart/IndividualStudentJoyChart'
import TotalTeamJoyChart from '../../components/StudentJoyChart/TotalTeamJoyChart'
import StudentJoyForm from '../../components/TeamJoyRating/StudentJoyForm'
import { useAuth } from '../../state/AuthProvider/AuthProvider'

const TeamView = () => {
  const [teamData, setTeamData] = useState(null)
  const { teamId } = useParams()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get(`/api/teams/${teamId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        setTeamData(response.data)
      } catch (error) {
        console.error('Error fetching team data:', error)
      }
      setIsLoading(false)
    }
    fetchTeam()
  }, [teamId, user.token])

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    gap: '20px',
  }

  const formContainerStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: '10px',
    backgroundColor: '#f1f3f5',
    borderRadius: '8px',
  }

  const chartsContainerStyle = {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '20px',
    padding: '10px',
  }

  const chartStyle = {
    flex: '1 1 30%',
    minWidth: '200px',
    height: '300px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  }
  if (isLoading) return <div>Loading...</div>
  return (
    <div style={containerStyle}>
      <h1 className="text-2xl font-bold mb-4 text-primary">{teamData.name}</h1>
      <div style={formContainerStyle}>
        <StudentJoyForm />
      </div>
      <div style={chartsContainerStyle}>
        <div style={chartStyle}>
          <IndividualStudentJoyChart />
        </div>
        <div style={chartStyle}>
          <AggregateJoyRatingsChart />
        </div>
        <div style={chartStyle}>
          <TotalTeamJoyChart />
        </div>
      </div>
    </div>
  )
}

export default TeamView
