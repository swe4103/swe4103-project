import { Outlet, Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../../state/AuthProvider/AuthProvider'

const ProtectedRoutes = () => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div>Loading...</div> // Handle loading state
  }

  // If the user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />
  }

  // If the user is an admin, restrict access to only the admin section
  if (user.user.role === 'ADMIN') {
    return <Navigate to="/admin" />
  }

  // Allow regular users to access other protected routes
  return <Outlet />
}

export default ProtectedRoutes
