import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import StudentJoyForm from '../../components/TeamJoyRating/StudentJoyForm'
import { useAuth } from '../../state/AuthProvider/AuthProvider'

const Home = () => {
  const { logout } = useAuth() // Get the logout function from AuthProvider
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/api/auth/logout', null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      logout()

      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <>
      <StudentJoyForm />
      <br />
      <button className="rounded-button" onClick={handleLogout}>
        Logout
      </button>
    </>
  )
}

export default Home
