import axios from 'axios'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import '../../App.css'
import { useAuth } from '../../state/AuthProvider/AuthProvider'

const LoginForm = () => {
  // State hooks for login email, password, and navigation
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [navigateToRegister, setNavigateToRegister] = useState(false) // State to manage navigation
  const { login } = useAuth() // Get login function from AuthProvider
  const navigate = useNavigate() // React Router hook for navigation

  // Event handlers for email, password
  const onEmailChange = event => {
    setLoginEmail(event.target.value)
  }

  const onPasswordChange = event => {
    setLoginPassword(event.target.value)
  }

  // Event handler for form submission
  const onSubmitLogin = async event => {
    // Prevent form from refreshing page
    event.preventDefault()
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email: loginEmail,
        password: loginPassword,
      })
      const { token, user } = response.data
      await login(token, user)

      // Handle successful login (e.g., set user state, redirect, etc.)
      console.log('Login successful:', response.data)
      navigate('/')
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Login failed! Please check your credentials.',
      )
    }
  }

  // If navigating to registration, render Navigate component
  if (navigateToRegister) {
    return <Navigate to="/register" /> // Adjust the path as necessary
  }

  return (
    <div className="login-signup-container">
      <h2>Login</h2>
      <form className="basic-form" onSubmit={onSubmitLogin}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your username"
            required
            value={loginEmail}
            onChange={onEmailChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            required
            value={loginPassword}
            onChange={onPasswordChange}
          />
        </div>
        <button type="submit" className="rounded-button">
          Login
        </button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div style={{ marginTop: '20px' }}>
        <p>Don&apos;t have an account?</p>
        <button className="rounded-button" onClick={() => setNavigateToRegister(true)}>
          Register Now
        </button>
      </div>
    </div>
  )
}

export default LoginForm
