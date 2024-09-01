// App.jsx
import { createBrowserRouter } from 'react-router-dom'
import Dashboard from './views/Dashboard'
import HomeView from './views/HomeView'
import ReportsView from './views/ReportsView'
import SettingsView from './views/SettingsView'
import ProfileView from './views/ProfileView'
import LoginView from './views/LoginView'

// Definir las rutas
const router = createBrowserRouter([
  {
    path: '/home',
    element: <LoginView />
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    children: [
      {
        path: 'home',
        element: <HomeView />
      },
      {
        path: 'reports',
        element: <ReportsView />
      },
      {
        path: 'settings',
        element: <SettingsView />
      },
      {
        path: 'profile',
        element: <ProfileView />
      }
    ]
  }
])

export default router
