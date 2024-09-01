import { Sun, Moon, Menu, X, DoorOpen } from 'lucide-react'
import { useContext } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { SIDEBAR_STATES } from '../constants/constants'
import { AuthContext } from '../../../contexts/AuthContext'

const Header = ({ darkMode, sidebarState, toggleSidebar, toggleDarkMode }) => {
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    const confirmed = window.confirm('¿Estás seguro de que deseas salir?')
    if (confirmed) {
      logout()
      navigate('/home')
    }
  }

  return (
    <header className="main-header">
      <button onClick={toggleSidebar} className="menu-toggle" aria-label="Toggle Sidebar">
        {sidebarState === SIDEBAR_STATES.HIDDEN ? <Menu /> : <X />}
      </button>
     
      <h1>Dashboard</h1>
      <div className="header-right">
        <button onClick={toggleDarkMode} className="theme-toggle" aria-label="Toggle Dark Mode">
          {darkMode ? <Sun /> : <Moon />}
        </button>

        <button onClick={handleLogout} className="logout-button">
          <DoorOpen />        
        </button>
      </div>
    </header>
  )
}

Header.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  sidebarState: PropTypes.string.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
}

export default Header
