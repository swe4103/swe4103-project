import { AgCharts } from 'ag-charts-react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useAuth } from '../../state/AuthProvider/AuthProvider'

const formatData = data => {
  let totalRating = 0
  const users = new Set()

  data.forEach(item => {
    users.add(item.userId)
    totalRating += item.rating
  })

  const diffFromPerfect = data.length * 5 - totalRating

  const retVal = [
    { Title: 'Rating to Perfect', Value: diffFromPerfect },
    { Title: 'Earned Rating', Value: totalRating },
  ]

  return retVal
}

const TotalTeamJoyChart = () => {
  const [chartOptions, setChartOptions] = useState({})

  const [formattedData, setFormattedData] = useState({})

  const { user } = useAuth()

  const { teamId } = useParams()

  useEffect(() => {
    // Replace with API Calls or some async data fetching
    const fetchJoyData = async () => {
      const today = new Date()
      const sevenDaysAgo = new Date()

      sevenDaysAgo.setDate(today.getDate() - 7)

      try {
        const params = {
          teamId: teamId,
          fromDate: sevenDaysAgo.toISOString(),
          toDate: today.toISOString(),
        }

        const headers = { Authorization: `Bearer ${user.token}` }
        const response = await axios.get('api/joy', {
          params: params,
          headers: headers,
        })
        if (!response.data) {
          console.error('No data to display')
        }
        console.log('Fetched data: ', response.data)

        const formatted = formatData(response.data)
        setFormattedData(formatted)
        console.log(formattedData)
      } catch (error) {
        console.error('Error fetching team joy: ', error)
      }
    }

    fetchJoyData()
  }, [user.user.id, user.token, teamId])

  useEffect(() => {
    const options = {
      title: { text: 'Team Joy' },
      series: [
        {
          data: formattedData,
          type: 'pie',
          angleKey: 'Value',
          calloutLabelKey: 'Title',
          sectorLabel: {
            color: 'black',
            fontWeight: 'bold',
          },
          fills: ['#C41E3A', '#228B22'],
        },
      ],
    }

    setChartOptions(options)
  }, [formattedData]) // Empty dependency array ensures this runs once after the component mounts

  return (
    <div style={{ width: '100%', height: '500px', backgroundColor: '#f8f9fa' }}>
      <AgCharts options={chartOptions} />
    </div>
  )
}

export default TotalTeamJoyChart
