// App.jsx
import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './hooks/ProtectedRoute'
// Vistas
import Dashboard      from './views/Dashboard'
import HomeView       from './views/HomeView'
import BillsView      from './views/BillsView.jsx'
import ClientsView    from './views/ClientsView.jsx'
import ShipmentsView  from './views/ShipmentsView.jsx'
import ReportsView    from './views/ReportsView'
import SettingsView   from './views/SettingsView'
import ProfileView    from './views/ProfileView'
import LoginView      from './views/LoginView'
import ErrorPage      from './views/ErrorPage.jsx'
import ClientDetail   from './views/ClientDetail.jsx'
// Action and Loader
import { loader as clientsLoader }      from './actionLoader/actionLoader.clientes.js'
import { loader as clientDetailLoader } from './actionLoader/actionLoader.clientDetail.js'
// Definir las rutas
const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginView />,
    errorElement: <ErrorPage />,
  },

  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'home',
        element: <HomeView />
      },
      {
        path: 'bills',
        element: <BillsView />
      },
      {
        path: 'clients',
        element: <ClientsView />,
        loader: clientsLoader,
        children: [
          {
            path: ':clientId',
            element: <ClientDetail />,
            loader: clientDetailLoader,
          }
        ]
      },
      {
        path: 'shipments',
        element: <ShipmentsView />
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
],
{
  basename: "/home", // Ajusta esto al subdirectorio donde esté alojada la aplicación en GitHub
}
)

export default router
