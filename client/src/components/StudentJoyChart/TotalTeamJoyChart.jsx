import { AgCharts } from 'ag-charts-react'
import { useState, useEffect } from 'react'

import getData from './Data'

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

  useEffect(() => {
    // Replace with API Calls or some async data fetching
    const data = getData()
    const formattedData = formatData(data)

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
  }, []) // Empty dependency array ensures this runs once after the component mounts

  return (
    <div style={{ width: '100%', height: '500px', backgroundColor: '#f8f9fa' }}>
      <AgCharts options={chartOptions} />
    </div>
  )
}

export default TotalTeamJoyChart
