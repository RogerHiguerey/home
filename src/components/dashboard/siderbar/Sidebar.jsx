import { SIDEBAR_STATES } from '../constants/constants.js';
import { NAV_ITEMS } from './Sidebar-Nav-Items.jsx';
import SidebarControls from './SidebarControls.jsx';
import SidebarNavItem from './SidebarNavItem.jsx';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

const Sidebar = ({ sidebarState }) => {
  const [internalState, setInternalState] = useState(
    sidebarState === SIDEBAR_STATES.HIDDEN ? SIDEBAR_STATES.EXPANDED : sidebarState
  );

  useEffect(() => {
    if (sidebarState === SIDEBAR_STATES.HIDDEN) {
      setInternalState(SIDEBAR_STATES.EXPANDED);
    }
  }, [sidebarState]);

  const toggleInternalState = () => {
    setInternalState((prevState) =>
      prevState === SIDEBAR_STATES.EXPANDED ? SIDEBAR_STATES.COLLAPSED : SIDEBAR_STATES.EXPANDED
    );
  };

  if (sidebarState === SIDEBAR_STATES.HIDDEN) {
    return null;
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
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

Sidebar.propTypes = {
  sidebarState: PropTypes.oneOf(Object.values(SIDEBAR_STATES)).isRequired
};

export default Sidebar;
