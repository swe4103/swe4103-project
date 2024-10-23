import { Outlet, Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../../state/AuthProvider/AuthProvider'

const AdminProtectedRoute = () => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div>Loading...</div>
  }

  // If the user is not logged in or is not an admin, redirect to login/home
  if (!user || user.user.role !== 'ADMIN') {
    return <Navigate to="/" state={{ from: location }} />
  }

  // If the user is an admin, allow access to the admin page
  return <Outlet />
}

export default AdminProtectedRoute
