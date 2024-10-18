import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import logo from '../../assets/images/doge.png'
import Card from '../../components/Card/Card'
import { useAuth } from '../../state/AuthProvider/AuthProvider'

const LoginForm = () => {
  // State hooks for login email, password, loading, and error message
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  // TODO add me const [errorMessage, setErrorMessage] = useState('')
  // const [navigateToRegister, setNavigateToRegister] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Loading state for login request

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
      // TODO add me setErrorMessage(
      //   error.response?.data?.message || 'Login failed! Please check your credentials.',
      // )
    } finally {
      setIsLoading(false) // Set loading state back to false
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-primary">
      <Card width="400px" height="600px" className="flex">
        <div className="flex flex-col items-center p-7 gap-5">
          <img src={logo} alt="Doge" width="50%" />
          <h2 className="text-2xl">Welcome</h2>
          <p>Sign in to continue to __insert_name__</p>
          <form className="flex flex-col gap-6 w-full" onSubmit={onSubmitLogin}>
            <input
              className="p-2 rounded-md border border-primary"
              type="email"
              id="email"
              placeholder="Email"
              required
              value={loginEmail}
              onChange={onEmailChange}
              disabled={isLoading} // Disable input when loading
            />
            <input
              className="p-2 rounded-md border border-primary"
              type="password"
              id="password"
              placeholder="Password"
              required
              value={loginPassword}
              onChange={onPasswordChange}
              disabled={isLoading} // Disable input when loading
            />
            <button
              type="submit"
              className="rounded-md bg-primary w-100 px-4 py-3 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'} {/* Show loading text if isLoading */}
            </button>
          </form>
        </div>
      </Card>
    </div>

    // <div className="login-signup-container">
    //   <h2>Login</h2>
    //   <form className="basic-form" onSubmit={onSubmitLogin}>
    //     <div className="input-group">
    //       <label htmlFor="email">Email</label>
    //       <input
    //         type="email"
    //         id="email"
    //         placeholder="Enter your username"
    //         required
    //         value={loginEmail}
    //         onChange={onEmailChange}
    //         disabled={isLoading} // Disable input when loading
    //       />
    //     </div>
    //     <div className="input-group">
    //       <label htmlFor="password">Password</label>
    //       <input
    //         type="password"
    //         id="password"
    //         placeholder="Enter your password"
    //         required
    //         value={loginPassword}
    //         onChange={onPasswordChange}
    //         disabled={isLoading} // Disable input when loading
    //       />
    //     </div>
    //     <button type="submit" className="rounded-button" disabled={isLoading}>
    //       {isLoading ? 'Logging in...' : 'Login'} {/* Show loading text if isLoading */}
    //     </button>
    //   </form>
    //   {errorMessage && <p className="error-message">{errorMessage}</p>}
    //   {/* <div style={{ marginTop: '20px' }}>
    //     <p>Don&apos;t have an account?</p>
    //     <button
    //       className="rounded-button"
    //       onClick={() => setNavigateToRegister(true)}
    //       disabled={isLoading}
    //     >
    //       Register Now
    //     </button>
    //   </div> */}
    // </div>
  )
}

export default LoginForm
