import { useState } from 'react'
import '../../App.css'

const LoginForm = ({ setIsRegister }) => {
  // State hooks for login email, password
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Event handlers for email, passowrd
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

    // TODO: Send request to API
    try {
      const response = await fetch('endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      })

      if (!response.ok) {
        throw new Error('Login failed! Please check your credentials.')
      }

      const data = await response.json()
      // Handle successful login (e.g., set user state, redirect, etc.)
      console.log('Login successful:', data)
    } catch (error) {
      setErrorMessage(error.message)
      return errorMessage
    }
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
      <div style={{ marginTop: '20px' }}>
        <p>Don&apos;t have an account?</p>
        <button className="rounded-button" onClick={() => setIsRegister(true)}>
          Register Now
        </button>
      </div>
    </div>
  )
}

export default LoginForm
