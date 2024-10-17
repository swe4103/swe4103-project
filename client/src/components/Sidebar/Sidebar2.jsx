import { useState } from 'react'
import { ProSidebar, Menu, MenuItem, SidebarHeader, SidebarFooter } from 'react-pro-sidebar'
import 'react-pro-sidebar/dist/css/styles.css'

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <ProSidebar collapsed={collapsed}>
      <SidebarHeader>
        <div className="header">
          <h3>Dawn&apos;s Favourite App</h3>
          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? 'Expand' : 'Collapse'}
          </button>
        </div>
      </SidebarHeader>
      <Menu iconShape="square">
        <MenuItem>Home</MenuItem>
        <MenuItem>Classes</MenuItem>
        <MenuItem>My Account</MenuItem>
      </Menu>
      <SidebarFooter>{/* Optional footer content */}</SidebarFooter>
    </ProSidebar>
  )
}

export default Sidebar
