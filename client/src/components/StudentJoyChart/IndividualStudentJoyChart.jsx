import { AgCharts } from 'ag-charts-react'
import { useState, useEffect } from 'react'

import getData from '../../utils/TempJoyData/TempJoyData'

const IndividualStudentJoyChart = () => {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    // Sample data replace with api call
    const data = getData()
    const formattedData = data.map(item => ({
      date: new Date(item.date),
      rating: item.rating,
    }))
    setChartData(formattedData)
  }, [])

  const options = {
    title: { text: 'Your Current Joy Rating' },
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
          formatter: ({ value }) => {
            const date = new Date(value)
            return date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })
          },
        },
      },
    ],
  }

  return (
    <div style={{ width: '100%', height: '400px', backgroundColor: '#f8f9fa' }}>
      <AgCharts options={options} />
    </div>
  )
}

export default IndividualStudentJoyChart
