import { useState } from 'react'

import RatingReview from './RatingReview'
import './teamJoy.css'

const StudentJoyForm = () => {
  const [rating, setRating] = useState(0)

  return (
    <>
      <div className="team-joy-form-container">
        <h3>Rate your week</h3>
        <RatingReview rating={rating} setRating={setRating} />
        <div style={{ marginTop: '15px' }}>
          <button type="submit" className="rounded-button">
            Submit
          </button>
        </div>
      </div>
    </>
  )
}

export default StudentJoyForm
