import { AgCharts } from 'ag-charts-react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useAuth } from '../../state/AuthProvider/AuthProvider'
const IndividualStudentJoyChart = () => {
  const [chartData, setChartData] = useState([])
  const { user } = useAuth()
  const { teamId } = useParams() // Access project and team IDs from the URL
  useEffect(() => {
    const fetchJoyData = async () => {
      const today = new Date()
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(today.getDate() - 7)

      try {
        const params = {
          userId: user.user.id,
          teamId: teamId,
          fromDate: sevenDaysAgo.toISOString(),
          toDate: today.toISOString(),
          listMembers: false,
        }
        const headers = { Authorization: `Bearer ${user.token}` }
        const response = await axios.get('/api/joy/', {
          params: params,
          headers: headers,
        })
        const data = response.data
        const formattedData = data.map(item => ({
          date: new Date(item.date),
          rating: item.rating,
        }))
        setChartData(formattedData)
      } catch (error) {
        console.error('Error fetching joy data:', error)
      }
    }

    fetchJoyData()
  }, [user.user.id, user.token, teamId])
  const formatDate = date => {
    const options = { month: 'short', day: 'numeric' }
    return new Date(date).toLocaleDateString('en-US', options)
  }
  const options = {
    title: { text: 'Recent Joy Ratings' },
    data: chartData,
    series: [
      {
        type: 'bar',
        direction: 'horizontal',
        xKey: 'date',
        yKey: 'rating',
        label: { enabled: true, formatter: ({ value }) => value.toString() },
      },
    ],
    axes: [
      { type: 'number', position: 'bottom', title: { text: 'Rating' }, max: 5 },
      {
        type: 'category',
        position: 'left',
        label: {
          formatter: ({ value }) => formatDate(value),
        },
      },
    ],
  }

  return <AgCharts options={options} />
}

export default IndividualStudentJoyChart
