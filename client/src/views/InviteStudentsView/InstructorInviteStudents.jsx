import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import Logo from '../../components/Logo/Logo'
import { useAuth } from '../../state/AuthProvider/AuthProvider'

const InstructorInviteStudents = () => {
  // State hooks
  const [emailList, setEmailList] = useState('') // Single input for email list
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('') // State to store success message
  const [isLoading, setIsLoading] = useState(false) // Loading state for invite request
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  // const [selectedStudents, setSelectedStudents] = useState([]) // Track selected students
  const { user, logout } = useAuth() // Get logout function from AuthProvider
  const navigate = useNavigate() // React Router hook for navigation
  const location = useLocation()

  // Handle the email list input change
  const onEmailListChange = event => {
    setEmailList(event.target.value)
  }

  // Fetch classes for the instructor
  useEffect(() => {
    if (location.state?.invalidToken) {
      setErrorMessage(
        'Invalid invite token. Please log in or contact your instructor or administrator',
      )
    }
    const fetchClasses = async () => {
      try {
        const token = user.token
        const config = { headers: { Authorization: `Bearer ${token}` } }
        let fetchedClasses = []
        const userResponse = await axios.get(`/api/users/${user.user.id}`, config)
        const newUser = userResponse.data
        user.user.groups = newUser.groups

        if (newUser.role.includes('INSTRUCTOR')) {
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
  }, [location.state, user])

  // Event handler for form submission
  const onSubmitInvite = async event => {
    event.preventDefault() // Prevent form from refreshing page
    setIsLoading(true) // Set loading state to true
    setErrorMessage('') // Clear any previous error messages
    setSuccessMessage('') // Clear any previous success messages
    if (!selectedClass) {
      setErrorMessage('Please select a class.')
      setIsLoading(false)
      return
    }
    console.log('selectedClass:', selectedClass)
    const emails = emailList.split(',').map(email => email.trim()) // Parse and trim the emails

    try {
      // Make an API call to invite students
      const response = await axios.post(
        '/api/users/invite',
        {
          emails: emails, // Send email list to the backend
          role: 'STUDENT',
          classId: selectedClass, // Add classId to the request body
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )

      if (response.status === 200) {
        // navigate('/success') // Navigate to success page on successful invite
        setSuccessMessage('Sent successfully!')
        setEmailList('')
        // setSelectedStudents(emails) // Track invited students
      } else {
        throw new Error('Unexpected response status') // Handle unexpected statuses
      }
    } catch (error) {
      console.error('Error sending invites:', error)
      setErrorMessage('Failed to send invites. Please check the emails and try again.')
    } finally {
      setIsLoading(false) // Set loading state back to false
    }
  }

  // Add Students to Team
  // const onAddToTeam = async () => {
  //   setIsLoading(true)
  //   setErrorMessage('')
  //   setSuccessMessage('')

  //   if (selectedStudents.length === 0) {
  //     setErrorMessage('No students to add. Please invite students first.')
  //     setIsLoading(false)
  //     return
  //   }

  //   console.log('Selected Students:', selectedStudents); // Debugging
  //   console.log('Selected Class:', selectedClass); // Debugging

  //   try {
  //     const response = await axios.post(
  //       'api/teams/invite/add-students',
  //       {
  //         students: selectedStudents, // List of student emails
  //         classId: selectedClass,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${user.token}`,
  //         },
  //       }
  //     )

  //     if (response.status === 200) {
  //       setSuccessMessage('Students were successfully added to the team!')
  //       setSelectedStudents([]) // Clear selected students
  //     } else {
  //       throw new Error('Unexpected response status')
  //     }
  //   } catch (error) {
  //     console.error('Error adding students to team:',{
  //       message: error.message,
  //       response: error.response?.data,
  //       status: error.response?.status,
  //     })
  //     setErrorMessage(
  //       error.response?.data?.error || 'Failed to add students to the team. Please try again.'
  //     )
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // Handle logout
  const handleLogout = () => {
    logout() // Call the logout function
    navigate('/login') // Redirect to the login page after logout
  }

  // Handle class selection change
  const handleClassChange = event => {
    setSelectedClass(event.target.value)
  }

  return (
    <div className="flex justify-center items-center h-screen bg-primary">
      <Card width="400px" height="600px" className="flex justify-center items-center">
        <div className="flex flex-col items-center p-7 gap-5 w-full">
          <Logo withText={true} coloured={true} className="p-3" />
          <h2 className="text-2xl">Invite Students</h2>
          <div className="mt-4">
            <label htmlFor="class-select" className="block text-sm font-medium text-gray-700">
              Select Class
            </label>
            <select
              id="class-select"
              value={selectedClass}
              onChange={handleClassChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="" disabled>
                Select a class
              </option>
              {classes.map(classItem => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </option>
              ))}
            </select>
          </div>

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

            {/* NEW: Error Message */}
            {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
            {/* NEW: Success Message */}
            {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

            {/* {errorMessage && <p className="text-danger text-center">{errorMessage}</p>} */}
            <Button type="submit" style={{ height: '50px' }} isLoading={isLoading}>
              Send Invites
            </Button>
          </form>
          {/* NEW: Submit Button to Add Students to Team */}
          {/* {selectedStudents.length > 0 && (
            // <Button onClick={onAddToTeam} style={{ marginTop: '20px' }} isLoading={isLoading}>
            //   Add Students to Team
            // </Button>
          )} */}
          {/* Logout Button placed within the Card */}
          <Button onClick={handleLogout} style={{ marginTop: '20px' }}>
            Logout
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default InstructorInviteStudents
