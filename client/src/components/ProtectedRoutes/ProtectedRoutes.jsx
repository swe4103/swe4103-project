import { Outlet, Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../../state/AuthProvider/AuthProvider.jsx'

const ProtectedRoutes = () => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.user.role === 'ADMIN' && location.pathname !== '/admin') {
    return <Navigate to="/admin" replace />
  }

  return <Outlet />
}

export default ProtectedRoutes
