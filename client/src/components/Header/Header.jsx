import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import { useAuth } from '../../state/AuthProvider/AuthProvider'
import { getTitle } from '../AppLayout/routes'
import Dropdown from '../Dropdown/Dropdown'

const Header = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

  const handleLogout = async () => {
    await axios.post('/api/auth/logout', null, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })

    logout()
    navigate('/login')
  }
  // Safeguarding getTitle usage by checking location and pathname existence
  const pageTitle =
    location && location.pathname ? getTitle(location.pathname) : 'Default Page Title'

  return (
    <header className="h-header w-full bg-white drop-shadow-md flex justify-between items-center px-7 sticky z-40">
      <h2 className="text-xl">{pageTitle}</h2>
      <div className="flex w-full justify-end gap-6">
        <Dropdown
          width="250px"
          content={
            <div className="grid grid-cols-1 text-sm text-slate-500">
              <div className="flex flex-col p-3 gap-2 items-center">
                <span>Name: {user.user.displayName}</span>
                <span>Email: {user.user.email}</span>
                <span>Role: {capitalize(user.user.role)}</span>
              </div>
              <hr />
              <Link
                className="p-3 hover:bg-slate-50 transition-ease overflow-hidden flex items-center gap-1"
                to="/settings"
              >
                <FontAwesomeIcon icon="gear" />
                <span>Settings</span>
              </Link>
              {/* Invite Students link directly below Settings */}
              {/* {user.user.role === 'instructor' && ( */}
              {user.user.role === 'INSTRUCTOR' && (
                <Link
                  className="p-3 hover:bg-slate-50 transition-ease overflow-hidden flex items-center gap-1"
                  to="/invite-students"
                >
                  <FontAwesomeIcon icon="plus" />
                  <span>Invite Students</span>
                </Link>
              )}
              {/* )} */}
              <Link
                className="p-3 hover:bg-slate-50 transition-ease overflow-hidden flex items-center gap-1 rounded-b"
                onClick={handleLogout}
              >
                <FontAwesomeIcon icon="right-from-bracket" />
                <span>Sign Out</span>
              </Link>
            </div>
          }
        >
          <FontAwesomeIcon className="text-2xl text-primary" icon="user"></FontAwesomeIcon>
        </Dropdown>
      </div>
    </header>
  )
}

export default Header
