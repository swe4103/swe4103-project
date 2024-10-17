import './AppLayout.scss'
import { useLocation } from 'react-router-dom'

import Sidebar2 from '../Sidebar/Sidebar'

const AppLayout = ({ children }) => {
  const location = useLocation() // going to use this to only render side nav bar conditionally
  const hideSidebarRoutes = ['/login', '/register']
  const showSidebar = !hideSidebarRoutes.includes(location.pathname)

  let sidebar = showSidebar ? <Sidebar2 /> : null // only show sidebar if we are not in login/register page
  return (
    <div className="app-layout">
      {sidebar}
      <main className="main-content">{children}</main>
    </div>
  )
}

export default AppLayout
