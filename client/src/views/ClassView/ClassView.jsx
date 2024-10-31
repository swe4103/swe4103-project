import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const ClassView = () => {
  const { classId } = useParams() // This hooks extract the `classId` from the URL
  const [classDetails, setClassDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        // Assuming you have an endpoint to fetch a specific class by ID
        const response = await axios.get(`http://localhost:3000/api/classes/${classId}`)
        setClassDetails(response.data) // Set the fetched data to state
        setIsLoading(false) // Set loading to false after data is fetched
      } catch (err) {
        setError('Failed to fetch class details') // Set error if the fetch fails
        setIsLoading(false) // Ensure loading is set to false on error
        console.error(err)
      }
    }

    fetchClassDetails() // Call the fetch function when component mounts or classId changes
  }, [classId]) // Dependency array to re-run the effect when classId changes

  if (isLoading) {
    return <div>Loading...</div> // Loading message while data is being fetched
  }

  if (error) {
    return <div>Error: {error}</div> // Display error if there is an issue fetching data
  }

  return (
    <div>
      {classDetails ? (
        <div>
          <h1>{classDetails.name}</h1> {/* Display the name of the class */}
          <p>Year: {classDetails.year}</p> {/* Display the year of the class */}
          {/* Further class details can be added here */}
        </div>
      ) : (
        <p>Class not found.</p> // This displays if no class details are available
      )}
    </div>
  )
}

export default ClassView
