import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

import Card from '../../components/Card/Card'
import LazyImage from '../../components/LazyImage/LazyImage'

const ClassesView = () => {
  const classes = useMemo(
    () => [
      { id: '1', name: 'Mathematics', year: 2023 },
      { id: '2', name: 'Physics', year: 2024 },
      { id: '3', name: 'Chemistry', year: 2023 },
      { id: '4', name: 'Biology', year: 2024 },
      { id: '5', name: 'History', year: 2025 },
    ],
    [],
  )

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const uniqueYears = useMemo(() => [...new Set(classes.map(c => c.year))], [classes])

  const filteredClasses = useMemo(
    () => classes.filter(c => c.year === selectedYear),
    [classes, selectedYear],
  )

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-lg font-bold pb-4">My Classes</h3>

      <Card className="flex flex-col items-center justfiy-center w-full p-6 h-full gap-4">
        <div className="flex flex-col w-full gap-2">
          <div className="flex w-full justify-around item-center">
            {uniqueYears.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`hover:underline transition-ease bg-transparent font-bold ${year === selectedYear ? ' underline' : 'text-dark'}`}
              >
                {year}
              </button>
            ))}
          </div>
          <hr className="w-full border-slate-200" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {filteredClasses.map(c => (
            <Link
              to={`/classes/${c.id}`}
              key={c.id}
              className="flex flex-col gap-3 bg-white border border-slate-200 p-4 rounded-md hover:shadow transition-ease"
            >
              <LazyImage
                src={`https://picsum.photos/seed/${c.id}/300/200`}
                alt={c.name}
                className="w-full h-40 object-cover rounded-md"
                placeholderClassName="w-full h-40 bg-gray-300 animate-pulse rounded-md"
              />

              <h2 className="text-md font-bold hover:underline">{c.name}</h2>
              <p className="text-sm text-gray-500">{c.year}</p>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default ClassesView
