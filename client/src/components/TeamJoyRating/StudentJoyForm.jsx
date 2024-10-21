import axios from 'axios'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import { useAuth } from '../../state/AuthProvider/AuthProvider'
import Button from '../Button/Button'
import Card from '../Card/Card'

import RatingReview from './RatingReview'

const StudentJoyForm = () => {
  const { teamId } = useParams() // Access project and team IDs from the URL
  const host = 'http://localhost:3000'
  const [rating, setRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null) // Store error message
  const [success, setSuccess] = useState(false) // Track success state
  const { user } = useAuth()

  const handleSubmit = async event => {
    event.preventDefault()

    try {
      setLoading(true)
      await axios.post(
        `${host}/joy`,
        {
          id: uuidv4(),
          userId: user.user.id,
          teamId: teamId,
          date: new Date().toISOString(),
          rating: rating,
        },
        { headers: { Authorization: user.token } },
      )
      setSuccess(true)
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating team joy')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="flex flex-col gap-4 items-center justify-center" height={200} width={300}>
      <h3>Rate your week</h3>
      <RatingReview rating={rating} setRating={setRating} />
      {success && <h1 className="text-success">Updated team joy successfully!</h1>}
      {error && <h1 className="text-danger">{error}</h1>}
      <Button isLoading={loading} onClick={handleSubmit}>
        Submit
      </Button>
    </Card>
  )
}

export default StudentJoyForm
