import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function RatingReview({ rating, setRating }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center', // Center horizontally
        alignItems: 'center', // Center vertically
        gap: '10px', // Space between stars
      }}
    >
      {[1, 2, 3, 4, 5].map(star => (
        <FontAwesomeIcon
          key={star}
          icon={rating >= star ? ['fas', 'star'] : ['far', 'star']}
          size="xl"
          style={{ cursor: 'pointer', color: rating >= star ? 'gold' : 'gray' }}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  )
}

export default RatingReview
