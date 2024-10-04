import { useState } from 'react'
import '../../App.css'

const RegisterForm = ({ setIsRegister }) => {
  // State hooks for email, password, and error
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

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
      const response = await fetch('endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
        }),
      })

      if (!response.ok) {
        throw new Error('Registration failed! Please try again.')
      }

      const data = response.json()
      // TODO: Handle successful registration (e.g., redirect, show message, etc.)
      console.log('Registration successful:', data)
    } catch (error) {
      setErrorMessage(error.message)
      return errorMessage
    }
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
          <button className="rounded-button" onClick={() => setIsRegister(false)}>
            Log In
          </button>
        </div>
      </form>
    </div>
  )
}

export default RegisterForm
