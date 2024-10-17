import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import AppLayout from './components/AppLayout/AppLayout.jsx'
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes'
import AuthProvider from './state/AuthProvider/AuthProvider'
import Home from './views/Home/Home.jsx'
import LoginForm from './views/LoginForm/LoginForm'
//import RegisterForm from './views/RegistrationForm/RegisterForm'

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoutes />}>
            {/* Dummy component for testing purposes */}
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Home />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
