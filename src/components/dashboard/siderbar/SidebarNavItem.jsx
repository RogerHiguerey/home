// SidebarNavItem.jsx
// import React from 'react'
// import PropTypes from 'prop-types'
// import { Link } from 'react-router-dom'
// const SidebarNavItem = ({ icon: Icon, label, path, isExpanded }) => (
//   <li>
//     <Link to={path}>
//       <Icon />
//       {isExpanded && <span>{label}</span>}
//     </Link>
//   </li>
// )
// SidebarNavItem.propTypes = {
//   icon: PropTypes.elementType.isRequired,
//   label: PropTypes.string.isRequired,
//   path: PropTypes.string.isRequired,
//   isExpanded: PropTypes.bool.isRequired
// }
// export default SidebarNavItem
import PropTypes from 'prop-types'

const SidebarNavItem = ({ icon: Icon, label, path, isExpanded, setCurrentView }) => {
  return (
    <li>
      <a href={`#${path}`} onClick={() => setCurrentView(path)} className="sidebar-nav-item">
        <Icon className="sidebar-nav-icon" />
        {isExpanded && <span className="sidebar-nav-label">{label}</span>}
      </a>
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
