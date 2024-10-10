import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import StudentJoyForm from '../../components/TeamJoyRating/StudentJoyForm'
import { useAuth } from '../../state/AuthProvider/AuthProvider'

const Home = () => {
  const { logout, user } = useAuth() // Get the logout function from AuthProvider
  const navigate = useNavigate()

  const handleLogout = async () => {
    await axios.post('http://localhost:3000/api/auth/logout', null, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })

    logout()
    navigate('/login')
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
