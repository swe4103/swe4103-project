import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import AppLayout from './components/AppLayout/AppLayout'
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes'
import AuthProvider from './state/AuthProvider/AuthProvider'
import ClassesView from './views/ClassesView/ClassesView'
import LoginForm from './views/LoginForm/LoginForm'
import RegisterForm from './views/RegistrationForm/RegisterForm'
import SettingsView from './views/SettingsView/SettingsView'
import TeamListView from './views/TeamListView/TeamListView'

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<AppLayout />}>
              <Route path="team-list" element={<TeamListView />} />
              <Route path="settings" element={<SettingsView />} />
              <Route index element={<ClassesView />} />
              {/* <Route path="classes/:classId" element={<ClassView />}>
                <Route path="projects/:projectId" element={<ProjectView />}>
                  <Route path="teams/:teamId" element={<TeamView />} />
                </Route>
              </Route> */}
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
