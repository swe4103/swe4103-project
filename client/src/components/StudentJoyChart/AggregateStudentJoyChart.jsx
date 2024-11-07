import { AgCharts } from 'ag-charts-react'
import { useState, useEffect } from 'react'

const AggregateStudentJoyRatingsChart = () => {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    // Sample data replace with api call
    const data = [
      { userId: 'User 1', rating: 4 },
      { userId: 'User 2', rating: 5 },
      { userId: 'User 3', rating: 3 },
      { userId: 'User 4', rating: 2 },
    ]
    setChartData(data)
    console.log(data)
  }, [])

  // const getData = () => {
  //   return [
  //     { userId: 'User 1', rating: 4 },
  //     { userId: 'User 2', rating: 5 },
  //     { userId: 'User 3', rating: 3 },
  //     { userId: 'User 4', rating: 2 },
  //   ]
  // }

  const options = {
    title: { text: 'Joy Ratings of Users' },
    data: chartData,
    series: [
      {
        type: 'bar',
        direction: 'horizontal',
        xKey: 'userId',
        yKey: 'rating',
        label: { enabled: true, formatter: ({ value }) => value.toString() },
      },
    ],
    axes: [
      { type: 'number', position: 'bottom', title: { text: 'Rating' }, max: 5 },
      { type: 'category', position: 'left' },
    ],
  }

  return (
    <div style={{ width: '100%', height: '400px', backgroundColor: '#f8f9fa' }}>
      <AgCharts options={options} />
    </div>
  )
}

export default AggregateStudentJoyRatingsChart
