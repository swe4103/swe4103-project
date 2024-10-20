import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import logo from '../../assets/images/doge.png'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import { useAuth } from '../../state/AuthProvider/AuthProvider'

const AdminView = () => {
  const [emails, setEmails] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const onEmailsChange = event => {
    setEmails(event.target.value)
  }

  const onSubmit = async event => {
    event.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      await axios.post(
        'http://localhost:3000/api/users/invite',
        {
          emails: emails.split(', ') || [],
          role: 'INSTRUCTOR',
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      setSuccessMessage('Instructors invited successfully!')
    } catch (error) {
      console.error(error)
      setErrorMessage('Failed to invite instructors. Please try again')
    } finally {
      setIsLoading(false)
    }
  }

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
    <div className="flex justify-center items-center h-screen bg-primary">
      <Card width="400px" height="600px" className="flex justify-center items-center">
        <div className="flex flex-col items-center p-7 gap-5">
          <img src={logo} alt="Doge" width="50%" />
          <h2 className="text-xl">Invite Instructors</h2>
          <form className="flex flex-col gap-6 w-full" onSubmit={onSubmit}>
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="email">Emails (Comma Separated List)</label>
              <input
                className="p-3 rounded-md border border-primary"
                type="text"
                id="email"
                placeholder="eg. user1@ex.com, user2@ex.com"
                required
                value={emails}
                onChange={onEmailsChange}
                disabled={isLoading}
              />
            </div>
            {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
            {successMessage && <p className="text-success text-center">{successMessage}</p>}
            <Button
              type="submit"
              style={{ height: '50px' }}
              disabled={isLoading}
              isLoading={isLoading}
            >
              Invite Instructors
            </Button>
          </form>
          <Link
            className="p-3 hover:text-slate-600 transition-ease overflow-hidden flex items-center gap-1 rounded-b"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon="right-from-bracket" />
            <span>Log Out</span>
          </Link>
        </div>
      </Card>
    </div>
  )
}

export default AdminView
