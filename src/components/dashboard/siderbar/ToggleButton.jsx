// ToggleButton.js
// import React from 'react'
import PropTypes from 'prop-types'
import { ChevronRight, ChevronLeft } from 'lucide-react'

const ToggleButton = ({ internalState, toggleInternalState }) => (
  <button
    className="absolute -right-3 top-9 bg-gray-800 rounded-full p-1"
    onClick={toggleInternalState}
  >
    {internalState === SIDEBAR_STATES.EXPANDED ? <ChevronLeft /> : <ChevronRight />}
  </button>
)

ToggleButton.propTypes = {
  internalState: PropTypes.oneOf(Object.values(SIDEBAR_STATES)).isRequired,
  toggleInternalState: PropTypes.func.isRequired
}

export default ToggleButton
