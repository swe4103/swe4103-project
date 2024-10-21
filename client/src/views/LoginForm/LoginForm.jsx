import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import Logo from '../../components/Logo/Logo'
import { useAuth } from '../../state/AuthProvider/AuthProvider'

const LoginForm = () => {
  // State hooks for login email, password, loading, and error message
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false) // Loading state for login request

  const { login } = useAuth() // Get login function from AuthProvider
  const navigate = useNavigate() // React Router hook for navigation
  const location = useLocation()

  // Event handlers for email, password
  const onEmailChange = event => {
    setLoginEmail(event.target.value)
  }

  const onPasswordChange = event => {
    setLoginPassword(event.target.value)
  }

  useEffect(() => {
    if (location.state?.invalidToken) {
      setErrorMessage(
        'Invalid invite token. Please log in or contact your instructor or administrator',
      )
    }
  }, [location.state])

  // Event handler for form submission
  const onSubmitLogin = async event => {
    event.preventDefault() // Prevent form from refreshing page
    setIsLoading(true) // Set loading state to true

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email: loginEmail,
        password: loginPassword,
      })
      await login(response.data)
      navigate('/')
    } catch (error) {
      console.error(error)
      setErrorMessage('Incorrect email or password')
    } finally {
      setIsLoading(false) // Set loading state back to false
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-primary">
      <Card width="400px" height="600px" className="flex justify-center items-center">
        <div className="flex flex-col items-center p-7 gap-5 w-full">
          <Logo withText={true} coloured={true} className="p-3" />
          <h2 className="text-2xl">Welcome</h2>
          <p>Sign in to continue to TimeFlow</p>
          <form className="flex flex-col gap-6 w-full" onSubmit={onSubmitLogin}>
            <input
              className="p-3 rounded-md border border-primary"
              type="email"
              id="email"
              placeholder="Email"
              required
              value={loginEmail}
              onChange={onEmailChange}
              disabled={isLoading} // Disable input when loading
            />
            <input
              className="p-3 rounded-md border border-primary"
              type="password"
              id="password"
              placeholder="Password"
              required
              value={loginPassword}
              onChange={onPasswordChange}
              disabled={isLoading} // Disable input when loading
            />
            {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
            <Button type="submit" style={{ height: '50px' }} isLoading={isLoading}>
              Login
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}

export default LoginForm
