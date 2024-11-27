import { AgCharts } from 'ag-charts-react'
import { useState, useEffect } from 'react'

const AggregateStudentJoyRatingsChart = () => {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    // Original data
    const data = [
      { date: 'Nov. 19', ratings: [3, 4, 4, 5, 2] },
      { date: 'Nov. 20', ratings: [0, 3, 2, 4, 1] },
      { date: 'Nov. 21', ratings: [5, 2, 3, 4, 5] },
      { date: 'Nov. 22', ratings: [2, 3, 4, 5, 4] },
      { date: 'Nov. 23', ratings: [4, 5, 3, 4, 5] },
    ]

    // Calculate average ratings for each day
    const chartData = data.map(item => ({
      date: item.date,
      average: item.ratings.reduce((a, b) => a + b, 0) / item.ratings.length,
    }))

    setChartData(chartData)
  }, [])

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
        stroke: '#f07b0a', // Accent
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
              content: `${params.xValue} ${params.yValue.toFixed(2)}`,
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', height: '400px' }}>
        <AgCharts options={chartOptions} />
      </div>
    </div>
  )
}

export default AggregateStudentJoyRatingsChart
