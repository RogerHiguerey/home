// SidebarControls.jsx
import PropTypes from 'prop-types'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { SIDEBAR_STATES } from '../constants/constants'

const SidebarControls = ({ internalState, toggleInternalState }) => {
  return (
    <div className="sidebar-controls">
      <button
        className="sidebar-controls-button"
        onClick={toggleInternalState}
        aria-label="Toggle Sidebar Size"
      >
        {internalState === SIDEBAR_STATES.EXPANDED ? <ChevronLeft /> : <ChevronRight />}
      </button>
    </div>
  )
}

SidebarControls.propTypes = {
  internalState: PropTypes.oneOf(Object.values(SIDEBAR_STATES)).isRequired,
  toggleInternalState: PropTypes.func.isRequired
}

export default SidebarControls
