// import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { sendRegistrationEmail } from '../../../../api/app/services/emailService'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import Logo from '../../components/Logo/Logo'
// import { useAuth } from '../../state/AuthProvider/AuthProvider'

// Main component for inviting students
const InstructorInviteStudents = () => {
  // State hooks for managing form input, error messages, and loading state
  const [emailList, setEmailList] = useState('') // Input for comma-separated student emails
  const [errorMessage, setErrorMessage] = useState('') // Error message displayed to the user
  const [isLoading, setIsLoading] = useState(false) // Tracks whether an API request is in progress

  // const { user, logout } = useAuth() // Access authenticated user and logout function
  const navigate = useNavigate() // Navigation hook for redirecting users
  const location = useLocation() // Location hook for accessing route state

  // Handle changes to the email input field
  const onEmailListChange = event => setEmailList(event.target.value)

  // Effect to handle invalid token errors passed via route state
  useEffect(() => {
    if (location.state?.invalidToken) {
      setErrorMessage(
        'Invalid invite token. Please log in or contact your instructor or administrator',
      )
    }
  }, [location.state])

  // Event handler for form submission
  const onSubmitInvite = async event => {
    event.preventDefault() // Prevent default form submission behavior
    setIsLoading(true) // Set loading state to true to disable the form while processing

    const emails = emailList.split(',').map(email => email.trim())

    try {
      // Send registration email for each email in the list
      await Promise.all(
        emails.map(async email => {
          const token = generateInviteToken()
          const message =
            'You have been invited to join Time Flow. Click the link below to register:'
          await sendRegistrationEmail(email, token, message)
        }),
      )

      navigate('/success')
    } catch (error) {
      console.error('Error sending invites:', error)
      setErrorMessage('Failed to send invites. Please check the emails and try again.') // Set error message for the user
    } finally {
      setIsLoading(false)
    }
  }

  // Utility function to generate an invite token
  const generateInviteToken = () => {
    return Math.random().toString(36).substring(2, 10)
  }

  // JSX for rendering the component
  return (
    <div className="flex justify-center items-center h-screen bg-primary">
      {/* Centered Card for the invite form */}
      <Card width="400px" height="600px" className="flex justify-center items-center">
        <div className="flex flex-col items-center p-7 gap-5 w-full">
          <Logo withText={true} coloured={true} className="p-3" /> {/* Display the logo */}
          <h2 className="text-2xl">Invite Students</h2> {/* Page title */}
          <p>Enter a list of student emails</p> {/* Instructions for the user */}
          <form className="flex flex-col gap-6 w-full" onSubmit={onSubmitInvite}>
            {/* Textarea for entering comma-separated emails */}
            <textarea
              className="p-3 rounded-md border border-primary h-40"
              id="emailList"
              placeholder="Enter student emails, separated by commas"
              required
              value={emailList}
              onChange={onEmailListChange}
              disabled={isLoading} // Disable input while loading
            />
            {/* Display error message if any */}
            {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
            {/* Submit button */}
            <Button type="submit" style={{ height: '50px' }} isLoading={isLoading}>
              Send Invites
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}

export default InstructorInviteStudents
