import { useState } from 'react'

import './App.css'
import LoginForm from './views/LoginForm/LoginForm'
import RegisterForm from './views/RegistrationForm/RegisterForm'

const App = () => {
  const [isRegister, setIsRegister] = useState(false) // Toggle between login and signup

  return (
    <div className="app-container">
      {isRegister ? (
        <RegisterForm setIsRegister={setIsRegister} /> // Show SignUpForm
      ) : (
        <LoginForm setIsRegister={setIsRegister} /> // Show LoginForm
      )}
    </div>
  )
}

export default App
