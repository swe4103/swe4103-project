import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import AppLayout from './components/AppLayout/AppLayout'
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes'
import AuthProvider from './state/AuthProvider/AuthProvider'
import Home from './views/Home/Home'
import LoginForm from './views/LoginForm/LoginForm'
import RegisterForm from './views/RegistrationForm/RegisterForm'

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route element={<ProtectedRoutes />}>
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
