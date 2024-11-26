import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import Dropdown from '../../components/Dropdown/Dropdown'
import { useAuth } from '../../state/AuthProvider/AuthProvider'

const ClassesView = () => {
  const { user, isLoading } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [className, setClassName] = useState('')
  const [classYear, setClassYear] = useState('')
  const [classes, setClasses] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [selectedYear, setSelectedYear] = useState('all')
  const [titleFilter, setTitleFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [editClassId, setEditClassId] = useState(null)
  const [editClassName, setEditClassName] = useState('')
  const [editClassYear, setEditClassYear] = useState('')

  const classesPerPage = 6

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = user.token
        const config = { headers: { Authorization: `Bearer ${token}` } }
        let fetchedClasses = []
        const userResponse = await axios.get(`/api/users/${user.user.id}`, config)
        const newUser = userResponse.data
        user.user.groups = newUser.groups

        if (newUser.role.includes('STUDENT')) {
          const responses = await Promise.all(
            newUser.groups.map(id => axios.get(`/api/classes?teamId=${id}`, config)),
          )
          fetchedClasses = responses.flatMap(response => response.data)
        } else if (newUser.role.includes('INSTRUCTOR')) {
          const responses = await Promise.all(
            newUser.groups.map(id => axios.get(`/api/classes/${id}`, config)),
          )
          fetchedClasses = responses.map(response => response.data)
        }

        setClasses(fetchedClasses)
      } catch (error) {
        console.error('Error fetching classes:', error)
      }
    }

    fetchClasses()
  }, [user])

  const handleSubmit = async e => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)

    const newClass = { name: className, year: parseInt(classYear) }
    try {
      const token = user.token
      const config = { headers: { Authorization: `Bearer ${token}` } }

      const response = await axios.post('/api/classes', newClass, config)
      await axios.put(
        `/api/users/${user.user.id}`,
        { groups: [...user.user.groups, response.data.id] },
        config,
      )
      setClasses(prevClasses => [...prevClasses, response.data])

      setClassName('')
      setClassYear('')
      setShowForm(false)
    } catch (error) {
      console.error('Error adding class:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  //edit class
  const handleEditSubmit = async e => {
    e.preventDefault()
    console.log('Submit triggered')
    if (isSubmitting) return

    // Check for empty values
    if (!editClassName.trim() || !editClassYear.trim()) {
      alert('Class name and year are required.')
      return
    }

    // Validate year input
    const year = parseInt(editClassYear, 10)
    if (isNaN(year) || year < 2000) {
      alert('Class year must be a valid number.')
      return
    }
    setIsSubmitting(true)
    try {
      console.log('sendin update request')
      const token = user.token
      const config = { headers: { Authorization: `Bearer ${token}` } }

      const updatedClass = { name: editClassName.trim(), year }
      console.log('Data prepared:', updatedClass)

      console.log('about to execute put request')

      console.log('Token:', user.token)

      console.log('API Endpoint:', `/api/classes/${editClassId}`)
      console.log(`CLASS ID:${editClassId}`)

      const response = await axios.put(
        `/api/classes/${editClassId}`,
        {
          name: editClassName.trim(),
          year: year,
        },
        { ...config }, // 5-second timeout
      )
      console.log('Update response:', response)

      // Update local state
      setClasses(prev => prev.map(c => (c.id === editClassId ? { ...c, ...updatedClass } : c)))
      console.log('Updated Classes:', classes)

      setEditClassId(null)
      setEditClassName('')
      setEditClassYear('')
    } catch (error) {
      console.log(`Error in PUT request: ${error}`)
      alert('Failed to update the class. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredClasses = classes.filter(c => {
    const matchesYear = selectedYear === 'all' || c.year.toString() === selectedYear
    const matchesTitle = titleFilter
      ? c.name.toLowerCase().includes(titleFilter.toLowerCase())
      : true
    return matchesYear && matchesTitle
  })

  const uniqueYears = ['All Years', ...new Set(classes.map(c => c.year.toString()))].sort()

  const totalClasses = filteredClasses.length
  const totalPages = Math.ceil(totalClasses / classesPerPage)
  const startIndex = (currentPage - 1) * classesPerPage
  const currentClasses = filteredClasses.slice(startIndex, startIndex + classesPerPage)

  const handlePageChange = direction => {
    if (direction === 'next' && currentPage < totalPages) setCurrentPage(prev => prev + 1)
    if (direction === 'prev' && currentPage > 1) setCurrentPage(prev => prev - 1)
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-lg font-bold pb-4">My Classes</h3>

      {user.user.role === 'INSTRUCTOR' && (
        <div className="flex gap-4 mb-4">
          <Button onClick={() => setShowForm(true)}>Create Class</Button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="class-form flex flex-col gap-4">
          <input
            type="text"
            placeholder="Class Name"
            value={className}
            onChange={e => setClassName(e.target.value)}
            required
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Class Year"
            value={classYear}
            onChange={e => setClassYear(e.target.value)}
            required
            className="p-2 border rounded"
          />
          <Button type="submit" disabled={isSubmitting}>
            Submit Class
          </Button>
        </form>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by title..."
          value={titleFilter}
          onChange={e => setTitleFilter(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      <div className="mb-4 flex justify-around items-center">
        {uniqueYears.map(year => (
          <button
            key={year}
            onClick={() => setSelectedYear(year === 'All Years' ? 'all' : year)}
            className={`hover:underline transition-ease ${
              (year === 'All Years' && selectedYear === 'all') || year === selectedYear
                ? 'underline'
                : 'text-dark'
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      <Card className="flex flex-col items-center justify-center w-full p-6 h-full gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {currentClasses.map(c => (
            <div
              key={c.id}
              className="flex flex-col gap-3 bg-white border p-4 rounded-md hover:shadow relative group"
            >
              <Link
                to={user.user.role === 'INSTRUCTOR' ? `/classes/${c.id}` : `/studentclass/${c.id}`}
                className="w-full"
              >
                <img
                  src={`https://picsum.photos/seed/${c.id}/300/200`}
                  alt={c.name}
                  className="w-full h-40 object-cover rounded-md"
                />
                <h2 className="text-md font-bold">{c.name}</h2>
                <p className="text-sm text-gray-500">{c.year}</p>
              </Link>

              {/* <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100"> */}
              <div className="absolute bottom-0 right-0 opacity-100">
                <Dropdown
                  width="250px"
                  content={
                    editClassId === c.id ? (
                      <form onSubmit={handleEditSubmit} className="p-3 flex flex-col gap-2">
                        <input
                          type="text"
                          value={editClassName}
                          onChange={e => setEditClassName(e.target.value)}
                          placeholder="Edit Name"
                          className="p-2 border rounded"
                          required
                        />
                        <input
                          type="number"
                          value={editClassYear}
                          onChange={e => setEditClassYear(e.target.value)}
                          placeholder="Edit Year"
                          className="p-2 border rounded"
                          required
                        />
                        <Button type="submit" disabled={isSubmitting}>
                          Submit
                        </Button>
                        <Button
                          type="button"
                          onClick={e => {
                            e.preventDefault()
                            setEditClassId(null)
                          }}
                        >
                          Cancel
                        </Button>
                      </form>
                    ) : (
                      <div className="p-2">
                        <button
                          onClick={e => {
                            e.preventDefault()
                            setEditClassId(c.id)
                            setEditClassName(c.name)
                            setEditClassYear(c.year.toString())
                          }}
                          className="w-full text-left p-2 hover:bg-gray-100 rounded"
                        >
                          Edit Class
                        </button>
                      </div>
                    )
                  }
                >
                  <FontAwesomeIcon
                    className="z-50 text-2xl text-primary bg-gray-400 p-2 rounded bg-opacity-0 flex items-center justify-center transition-all duration-300 hover:bg-opacity-80 hover:bg-gray-400"
                    icon="ellipsis"
                    onClick={e => {
                      e.preventDefault() //don't remove, causes navigation issues.
                    }}
                  />
                </Dropdown>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <div className="flex justify-between mt-4">
        <Button onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button onClick={() => handlePageChange('next')} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    </div>
  )
}

export default ClassesView
