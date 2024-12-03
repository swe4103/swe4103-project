import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import Logo from '../../components/Logo/Logo'
import { useAuth } from '../../state/AuthProvider/AuthProvider'

const AdminView = () => {
  // State hooks
  const [emailList, setEmailList] = useState('') // Single input for email list
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false) // Loading state for invite request

  const { user, logout } = useAuth() // Get logout function from AuthProvider
  const navigate = useNavigate() // React Router hook for navigation
  const location = useLocation()

  // Handle the email list input change
  const onEmailListChange = event => {
    setEmailList(event.target.value)
  }

  useEffect(() => {
    if (location.state?.invalidToken) {
      setErrorMessage(
        'Invalid invite token. Please log in or contact your instructor or administrator',
      )
    }
  }, [location.state])

  // Event handler for form submission
  const onSubmitInvite = async event => {
    event.preventDefault() // Prevent form from refreshing page
    setIsLoading(true) // Set loading state to true

    const emails = emailList.split(',').map(email => email.trim()) // Parse and trim the emails

    try {
      // Make an API call to invite students
      const response = await axios.post(
        '/api/users/invite',
        {
          emails: emails, // Send email list to the backend
          role: 'INSTRUCTOR',
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )

      if (response.status === 200) {
        // navigate('/success') // Navigate to success page on successful invite
        setSuccessMessage('Invited user succesfully!')
      }
    } catch (error) {
      console.error(error)
      setErrorMessage('Failed to send invites. Please check the emails and try again.')
    } finally {
      setIsLoading(false) // Set loading state back to false
    }
  }

  // Handle logout
  const handleLogout = () => {
    logout() // Call the logout function
    navigate('/login') // Redirect to the login page after logout
  }

  return (
    <div className="flex justify-center items-center h-screen bg-primary">
      <Card width="400px" height="600px" className="flex justify-center items-center">
        <div className="flex flex-col items-center p-7 gap-5 w-full">
          <Logo withText={true} coloured={true} className="p-3" />
          <h2 className="text-2xl">Invite Students</h2>
          <p>Enter a list of student emails, comma-separated</p>
          <form className="flex flex-col gap-6 w-full" onSubmit={onSubmitInvite}>
            <textarea
              className="p-3 rounded-md border border-primary h-40"
              id="emailList"
              placeholder="Enter student emails, separated by commas"
              required
              value={emailList}
              onChange={onEmailListChange}
              disabled={isLoading} // Disable input when loading
            />

            {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
            {successMessage && <p className="text-success text-center">{successMessage}</p>}
            <Button type="submit" style={{ height: '50px' }} isLoading={isLoading}>
              Send Invites
            </Button>
          </form>
          {/* Logout Button placed within the Card */}
          <Button onClick={handleLogout} style={{ marginTop: '20px' }}>
            Logout
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default AdminView
