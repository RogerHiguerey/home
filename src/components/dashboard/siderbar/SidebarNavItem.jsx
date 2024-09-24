// SidebarNavItem.jsx
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types'

const SidebarNavItem = ({ icon: Icon, label, path, isExpanded }) => {
  return (
    <li>
    <NavLink 
      to={`/dashboard/${path}`} 
      className="sidebar-nav-item" 
      activeClassName="active"
    >
      <Icon className="sidebar-nav-icon" />
      {isExpanded && <span className="sidebar-nav-label">{label}</span>}
    </NavLink>
  </li>
  )
}

SidebarNavItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  setCurrentView: PropTypes.func.isRequired
}

export default SidebarNavItem
