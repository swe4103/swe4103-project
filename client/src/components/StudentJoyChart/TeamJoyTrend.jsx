import { AgCharts } from 'ag-charts-react'
import axios from 'axios'
import { useState, useEffect } from 'react'

import { useAuth } from '../../state/AuthProvider/AuthProvider'

const AggregateStudentJoyRatingsChart = ({ teamId }) => {
  const [chartData, setChartData] = useState([])
  const [hasData, setHasData] = useState(false)

  const { user } = useAuth()

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

        const data = response.data

        const groupedByDate = data.reduce((acc, curr) => {
          // Extract the date (ignoring time)
          const dateOnly = new Date(curr.date).toISOString().split('T')[0]
          if (!acc[dateOnly]) {
            acc[dateOnly] = []
          }
          acc[dateOnly].push(curr.rating)
          return acc
        }, {})

        // Calculate average for each group
        const averages = Object.entries(groupedByDate).map(([date, ratings]) => {
          const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          return { date, average }
        })

        // Set chart data using averages
        const chartData = averages.map(item => ({
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          average: item.average,
        }))

        setHasData(true)
        setChartData(chartData)
      } catch (error) {
        console.error('Error fetching joy data: ', error)
        setHasData(false)
      }
    }

    fetchJoyData()
  }, [user.token, teamId])

  const chartOptions = {
    data: chartData,
    title: {
      text: 'Team Joy Trend',
      fontSize: 15,
      fontWeight: 'bold',
      color: '#4a4a4a',
    },
    series: [
      {
        type: 'line',
        xKey: 'date',
        yKey: 'average',
        stroke: '#f07b0b', // Accent
        strokeWidth: 3,
        marker: {
          enabled: true,
          shape: 'circle',
          size: 8,
          fill: '#f07b0a', // Accent
          stroke: '#ffffff', // White color for the marker stroke
          strokeWidth: 2,
        },
        tooltip: {
          renderer: params => {
            return {
              content: `${params.xValue} ${params.yValue}`,
            }
          },
        },
      },
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        label: { rotation: 45, fontSize: 8, color: '#4a4a4a' },
      },
      {
        type: 'number',
        position: 'left',
        label: { fontSize: 12, color: '#4a4a4a' },
        min: 1,
        max: 5,
      },
    ],
  }

  if (hasData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', height: '400px' }}>
          <AgCharts options={chartOptions} />
        </div>
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

export default AggregateStudentJoyRatingsChart
