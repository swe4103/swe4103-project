import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import { useAuth } from '../../state/AuthProvider/AuthProvider'
const ClassesView = () => {
  const { user, isLoading } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [className, setClassName] = useState('')
  const [classYear, setClassYear] = useState('')
  const [classes, setClasses] = useState([])
  const [deleteTitle, setDeleteTitle] = useState('')
  const [showDeleteInput, setShowDeleteInput] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [selectedYear, setSelectedYear] = useState('all')
  const [titleFilter, setTitleFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
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
        console.log('newUser:', newUser)
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

  const handleDelete = async () => {
    const classToDelete = classes.find(c => c.name === deleteTitle)
    if (!classToDelete) {
      alert('No class found with that name.')
      return
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete "${deleteTitle}"?`)
    if (!confirmDelete) return

    try {
      const token = user.token
      const config = { headers: { Authorization: `Bearer ${token}` } }

      await axios.delete(`/api/classes/${classToDelete.id}`, config)
      setClasses(classes.filter(c => c.id !== classToDelete.id))
      setDeleteTitle('')
      setShowDeleteInput(false)
    } catch (error) {
      console.error('Error deleting class:', error)
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
          <Button
            onClick={() => setShowDeleteInput(prev => !prev)}
            className="bg-red-500 text-white"
          >
            {showDeleteInput ? 'Cancel Delete' : 'Delete Class'}
          </Button>
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

      {showDeleteInput && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Enter Class Name to Delete"
            value={deleteTitle}
            onChange={e => setDeleteTitle(e.target.value)}
            className="p-2 border rounded mb-2"
          />
          <Button onClick={handleDelete} disabled={!deleteTitle}>
            Confirm Delete
          </Button>
        </div>
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
            <Link
              to={user.user.role === 'INSTRUCTOR' ? `/classes/${c.id}` : `/studentclass/${c.id}`}
              key={c.id}
              className="flex flex-col gap-3 bg-white border p-4 rounded-md hover:shadow"
            >
              <img
                src={`https://picsum.photos/seed/${c.id}/300/200`}
                alt={c.name}
                className="w-full h-40 object-cover rounded-md"
              />
              <h2 className="text-md font-bold">{c.name}</h2>
              <p className="text-sm text-gray-500">{c.year}</p>
            </Link>
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
