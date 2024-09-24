// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';  // Importar PropTypes
import { useAuthStore, useInitializeAuth } from '../store/auth.jsx';

const ProtectedRoute = ({ children }) => {
  useInitializeAuth();
  
  const { isAuthenticated } = useAuthStore();
  console.log("ProtectedRoute.jsx isAuthenticated", isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/"/>;
  }

  return children;
};

// Validación de PropTypes
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
