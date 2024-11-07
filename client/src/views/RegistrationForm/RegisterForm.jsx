import axios from 'axios'
import { useState, useEffect } from 'react'
import { Navigate, useSearchParams, useNavigate } from 'react-router-dom'

import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import Logo from '../../components/Logo/Logo'
import { useAuth } from '../../state/AuthProvider/AuthProvider'

const RegisterForm = () => {
  // State hooks for email, password, confirm password, error, and navigation
  const [isValidToken, setIsValidToken] = useState(null) // Track token validity
  const [searchParams] = useSearchParams() // Get query params
  const token = searchParams.get('token') // Extract the token
  const [displayName, setDisplayName] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [email, setEmail] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate() // React Router hook for navigation

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const validateToken = async () => {
      try {
        const url = `/api/auth/validate-token?token=${token}&type=invite`
        const response = await axios.get(url)
        if (response.data.valid) {
          setEmail(response.data.decoded.email)
          setIsValidToken(true) // Token is valid, allow rendering
        } else {
          setIsValidToken(false) // Invalid token, redirect or show error
        }
      } catch (error) {
        console.error('Token validation failed:', error)
        setIsValidToken(false)
      } finally {
        setIsLoading(false)
      }
    }

    if (token) {
      validateToken()
    } else {
      setIsValidToken(false) // No token provided, redirect or show error
      setIsLoading(false)
    }
  }, [token])

  if (!isLoading && isValidToken === false) {
    return (
      <Navigate to="/login" state={{ invalidToken: true }} /> // Redirect to login if invalid token
    )
  }

  // Event handlers for display name, password, confirm password
  const onDisplayNameChange = event => {
    setDisplayName(event.target.value)
  }

  const onPasswordChange = event => {
    setRegisterPassword(event.target.value)
  }

  const onConfirmPasswordChange = event => {
    setConfirmPassword(event.target.value)
  }

  // Event handler for form submission
  const onSubmitRegister = async event => {
    // Prevent form from refreshing page

    event.preventDefault()

    // Check if passwords match
    if (registerPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match')
      return
    }

    try {
      setIsLoading(true)

      const response = await axios.post(`/api/auth/register?token=${token}`, {
        displayName: displayName,
        password: registerPassword,
      })

      // Handle successful registration (e.g., redirect, show message, etc.)
      console.log('Registration successful:', response.data)
      const loginResponse = await axios.post('/api/auth/login', {
        email: email,
        password: registerPassword,
      })
      await login(loginResponse.data)
      navigate('/')

      // Set navigateToLogin to true after successful registration
    } catch (error) {
      setIsLoading(false)
      setErrorMessage(error.response?.data?.message || 'Registration failed! Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-signup-container">
      <div className="flex justify-center items-center h-screen bg-primary">
        <Card width="400px" height="600px" className="flex justify-center">
          <div className="flex flex-col items-center p-7 gap-5">
            <Logo withText={true} coloured={true} className="p-3" />
            <h2 className="text-2xl">Welcome</h2>
            <p>Sign in to continue to FlowBoard</p>
            <form className="flex flex-col gap-6 w-full" onSubmit={onSubmitRegister}>
              <input
                className="p-2 rounded-md border border-primary"
                type="display-name"
                id="display-name"
                placeholder="Display Name"
                required
                value={displayName}
                onChange={onDisplayNameChange}
                disabled={isLoading} // Disable input when loading
              />
              <input
                className="p-2 rounded-md border border-primary"
                type="password"
                id="password"
                placeholder="Password"
                required
                value={registerPassword}
                onChange={onPasswordChange}
                disabled={isLoading} // Disable input when loading
              />
              <input
                className="p-2 rounded-md border border-primary"
                type="password"
                id="password"
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={onConfirmPasswordChange}
                disabled={isLoading} // Disable input when loading
              />
              {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
              <Button type="submit" style={{ height: '50px' }} isLoading={isLoading}>
                Register
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default RegisterForm
