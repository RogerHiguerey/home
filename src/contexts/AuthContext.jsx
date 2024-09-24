// AuthContext.jsx
import { 
  createContext, 
  useState, 
  useEffect 
} from 'react';
import PropTypes    from 'prop-types';
import authService  from '../services/auth.service.js';

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const login = async (username, password) => {
    try {
      const token = await authService.login(username, password);
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};