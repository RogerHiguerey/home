import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import classNames from 'classnames'

import { SIDEBAR_STATES } from '../components/dashboard/constants/constants'
import Sidebar from '../components/dashboard/siderbar/Sidebar'
import Header from '../components/dashboard/header/Header'

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarState, setSidebarState] = useState(SIDEBAR_STATES.EXPANDED)
  const navigate = useNavigate()

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode)
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  const toggleSidebar = () => {
    setSidebarState((prevState) =>
      prevState === SIDEBAR_STATES.HIDDEN ? SIDEBAR_STATES.EXPANDED : SIDEBAR_STATES.HIDDEN
    )
  }

  const handleNavigation = (view) => {
    navigate(view)
  }

  return (
    <div className={classNames('dashboard', { dark: darkMode, light: !darkMode })}>
      <Header
        darkMode={darkMode}
        toggleSidebar={toggleSidebar}
        toggleDarkMode={toggleDarkMode}
        sidebarState={sidebarState}
      />
      <div className="dashboard-content">
        <Sidebar
          sidebarState={sidebarState}
          setSidebarState={setSidebarState}
          setCurrentView={handleNavigation}
        />
        <main>
          <Outlet /> {/* Renderiza la vista específica de la ruta */}
        </main>
      </div>
    </div>
  )
}

export default Dashboard
