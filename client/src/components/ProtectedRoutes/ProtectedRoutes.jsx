import { Outlet, Navigate } from 'react-router-dom'

import { useAuth } from '../../state/AuthProvider/AuthProvider.jsx'

const ProtectedRoutes = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return user ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoutes
