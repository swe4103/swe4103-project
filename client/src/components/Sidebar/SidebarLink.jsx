import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useLocation } from 'react-router-dom'

const SidebarLink = ({ to, icon, label, active }) => {
  const location = useLocation()
  const isVisible = active ? 'block' : 'hidden'
  const isCenter = active ? 'justify-normal' : 'justify-center'
  const isActive = location.pathname === to ? 'bg-secondary' : ''

  return (
    <div className="px-4">
      <Link
        to={to}
        className={`flex items-center h-12 gap-3 p-4 rounded-lg hover:bg-secondary transition-ease ${isActive} ${isCenter} `}
      >
        <FontAwesomeIcon className="text-lg" icon={icon} />
        <span className={`${isVisible} text-nowrap`}>{label}</span>
      </Link>
    </div>
  )
}

export default SidebarLink
