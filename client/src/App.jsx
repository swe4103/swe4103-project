import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import AdminProtectedRoute from './components/AdminProtectedRoute/AdminProtectedRoute'
import AppLayout from './components/AppLayout/AppLayout'
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes'
import AuthProvider from './state/AuthProvider/AuthProvider'
import AdminView from './views/AdminView/AdminView'
import ClassesView from './views/ClassesView/ClassesView'
import ClassView from './views/ClassView/ClassView'
import LoginForm from './views/LoginForm/LoginForm'
import ProjectList from './views/ProjectList/ProjectList'
import ProjectView from './views/ProjectView/ProjectView'
import RegisterForm from './views/RegistrationForm/RegisterForm'
import SettingsView from './views/SettingsView/SettingsView'
//import TeamListView from './views/TeamListView/TeamListView'
import TeamJoyView from './views/TeamJoyView/TeamJoyView'
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* General protected routes for non-admin users */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<AppLayout />}>
              <Route path="project/:projectId" element={<ProjectView />} />
              <Route path="team/:teamId" element={<TeamJoyView />} />
              <Route path="settings" element={<SettingsView />} />
              <Route index element={<ClassesView />} />
              <Route path="studentclass/:classId/" element={<ProjectList />} />
              <Route path="classes/:classId" element={<ClassView />} />
            </Route>
          </Route>

          {/* Admin protected route */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminView />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
