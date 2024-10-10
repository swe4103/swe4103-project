import axios from 'axios'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import '../../App.css'

const RegisterForm = () => {
  // State hooks for email, password, confirm password, error, and navigation
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [navigateToLogin, setNavigateToLogin] = useState(false) // State to manage navigation

  // Event handlers for email, password, confirm password
  const onEmailChange = event => {
    setRegisterEmail(event.target.value)
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
      setErrorMessage('Error: Passwords do not match')
      alert(errorMessage)
      return
    } else {
      setErrorMessage('')
    }

    // TODO: Send request to API
    try {
      const response = await axios.post('endpoint', {
        email: registerEmail,
        password: registerPassword,
      })

      // Handle successful registration (e.g., redirect, show message, etc.)
      console.log('Registration successful:', response.data)
      // Set navigateToLogin to true after successful registration
      setNavigateToLogin(true)
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Registration failed! Please try again.')
    }
  }

  // If navigating to login, render Navigate component
  if (navigateToLogin) {
    return <Navigate to="/login" /> // Adjust the path as necessary
  }

  return (
    <div className="login-signup-container">
      <h2>Register</h2>
      <form className="basic-form" onSubmit={onSubmitRegister}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Create a username"
            required
            value={registerEmail}
            onChange={onEmailChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Create a password"
            required
            value={registerPassword}
            onChange={onPasswordChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password-confirm">Confirm Password</label>
          <input
            type="password"
            id="passwordConfirm"
            placeholder="Re-enter password"
            required
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
          />
        </div>
        <button type="submit" className="rounded-button">
          Register
        </button>
        <div style={{ marginTop: '20px' }}>
          <p>Already have an account?</p>
          <button className="rounded-button" onClick={() => setNavigateToLogin(true)}>
            Log In
          </button>
        </div>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  )
}

export default RegisterForm
