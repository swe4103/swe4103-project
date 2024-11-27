import { AgCharts } from 'ag-charts-react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useAuth } from '../../state/AuthProvider/AuthProvider'

const TotalTeamJoyChart = () => {
  const [chartOptions, setChartOptions] = useState({})
  const [formattedData, setFormattedData] = useState([])
  const [hasData, setHasData] = useState(false)
  const { user } = useAuth()
  const { teamId } = useParams()

  useEffect(() => {
    const fetchJoyData = async () => {
      const today = new Date()
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(today.getDate() - 7)

      const params = {
        teamId: teamId,
        fromDate: sevenDaysAgo.toISOString(),
        toDate: today.toISOString(),
        listMembers: true,
      }

      const headers = { Authorization: `Bearer ${user.token}` }

      try {
        const response = await axios.get('/api/joy', {
          params: params,
          headers: headers,
        })

        if (response.headers['content-type'].includes('text/html')) {
          console.error('Received HTML response, expected JSON.')
          setHasData(false)
          return
        }

        if (!response.data || response.data.length === 0) {
          console.error('No data to display')
          setHasData(false)
          return
        }

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

        const formatted = formatData(response.data)
        setFormattedData(formatted)
        setHasData(true)
      } catch (error) {
        console.error('Error fetching team joy data:', error)
        setHasData(false)
      }
    }

    fetchJoyData()
  }, [user.token, teamId])

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
  }, [formattedData])

  if (hasData) {
    return (
      <div style={{ width: '100%', height: '500px', backgroundColor: '#f8f9fa' }}>
        <AgCharts options={chartOptions} />
      </div>
    )
  } else {
    return (
      <div style={{ width: '100%', height: '500px', backgroundColor: '#f8f9fa' }}>
        <h1>No Data Available</h1>
      </div>
    )
  }
}

export default TotalTeamJoyChart
