import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { SIDEBAR_STATES } from '../constants/constants'
import SidebarControls from './SidebarControls'
import { NAV_ITEMS } from './Sidebar-Nav-Items'
import SidebarNavItem from './SidebarNavItem'

const Sidebar = ({ sidebarState, setCurrentView }) => {
  const [internalState, setInternalState] = useState(
    sidebarState === SIDEBAR_STATES.HIDDEN ? SIDEBAR_STATES.EXPANDED : sidebarState
  )

  useEffect(() => {
    if (sidebarState === SIDEBAR_STATES.HIDDEN) {
      setInternalState(SIDEBAR_STATES.EXPANDED)
    }
  }, [sidebarState])

  const toggleInternalState = () => {
    setInternalState((prevState) =>
      prevState === SIDEBAR_STATES.EXPANDED ? SIDEBAR_STATES.COLLAPSED : SIDEBAR_STATES.EXPANDED
    )
  }

  if (sidebarState === SIDEBAR_STATES.HIDDEN) {
    return null
  }

  return (
    <aside className={`sidebar ${internalState}`}>
      <SidebarControls internalState={internalState} toggleInternalState={toggleInternalState} />
      <nav>
        <ul>
          {NAV_ITEMS.map(({ icon, label, path }) => (
            <SidebarNavItem
              key={path}
              icon={icon}
              label={label}
              path={path}
              isExpanded={internalState === SIDEBAR_STATES.EXPANDED}
              setCurrentView={setCurrentView}
            />
          ))}
        </ul>
      </nav>
    </aside>
  )
}

Sidebar.propTypes = {
  sidebarState: PropTypes.oneOf(Object.values(SIDEBAR_STATES)).isRequired,
  setCurrentView: PropTypes.func.isRequired
}

export default Sidebar
