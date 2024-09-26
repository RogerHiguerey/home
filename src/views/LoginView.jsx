// LoginView.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import Modal from '../components/modals/Modal.jsx';
import Button from '../components/button/Button.jsx';
import axios from 'axios';
import '../styles/Login.css';

const LoginView = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { token, login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirige si ya está autenticado
  useEffect(() => {
    if (token) navigate('/dashboard');
  }, [token, navigate]);

  // Maneja los cambios en los campos de entrada
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  // Función de login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const { username, password } = credentials;

    if (!username || !password) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    setLoading(true);

    try {
      const token = await fetchLogin(username, password); // Solicitud de login
      login(token); // Almacena el token
      navigate('/dashboard'); // Redirige al dashboard
    } catch (error) {
      console.error(error);
      setError('Nombre de usuario o contraseña incorrectos. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Limpia el modal de error
  const handleCloseModal = () => setError('');

  // Refactorización de la función de login para usar Axios
  const fetchLogin = async (username, password) => {
    try {
      const response = await axios.post('https://api-pfxl.onrender.com/api/users/login',
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      return response.data.token;
    } catch (error) {
      if (error.response) {
        // Error de la respuesta del servidor
        throw new Error(error.response.data.message || 'Error al iniciar sesión');
      } else if (error.request) {
        // No hubo respuesta del servidor
        throw new Error('No se pudo establecer conexión con el servidor');
      } else {
        // Otro error
        throw new Error('Error inesperado al iniciar sesión');
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <input
          name="username"
          type="text"
          placeholder="Nombre de Usuario"
          value={credentials.username}
          autoComplete="username"
          onChange={handleInputChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={credentials.password}
          autoComplete="current-password"
          onChange={handleInputChange}
        />
        <Button type="submit" variant="primary" size="medium" disabled={loading}>
          {loading ? 'Cargando...' : 'Ingresar'}
        </Button>
      </form>
      {error && (
        <Modal
          title="Error de Inicio de Sesión"
          message={error}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default LoginView;
