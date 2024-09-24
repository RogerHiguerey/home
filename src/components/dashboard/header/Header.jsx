import PropTypes from 'prop-types'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sun, Moon, Menu, X, DoorOpen } from 'lucide-react'

import { SIDEBAR_STATES } from '../constants/constants.js'
import { useAuthStore } from '../../../store/auth.jsx'
import LogoutConfirmationModal from '../../modals/LogoutConfirmationModal.jsx' // Importa el modal

const Header = ({ darkMode, sidebarState, toggleSidebar, toggleDarkMode }) => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal

  const handleLogout = async () => {
    try {
      const logoutSuccess = await logout();
      if (logoutSuccess) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleConfirmLogout = () => {
    setShowModal(false); // Oculta el modal
    handleLogout(); // Ejecuta el logout
  };

  const handleCancelLogout = () => {
    setShowModal(false); // Simplemente oculta el modal
  };

  return (
    <>
      <header className="main-header">
        <button onClick={toggleSidebar} className="menu-toggle" aria-label="Toggle Sidebar">
          {sidebarState === SIDEBAR_STATES.HIDDEN ? <Menu /> : <X />}
        </button>
        <h1>Gestion de Envios</h1>
        <div className="header-right">
          <button onClick={toggleDarkMode} className="theme-toggle" aria-label="Toggle Dark Mode">
            {darkMode ? <Sun /> : <Moon />}
          </button>
          <button onClick={() => setShowModal(true)} className="logout-button" aria-label="Logout">
            <DoorOpen />
          </button>
        </div>
      </header>

      {showModal && (
        <LogoutConfirmationModal
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
        />
      )}
    </>
  );
};

Header.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  sidebarState: PropTypes.string.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};

export default Header;
