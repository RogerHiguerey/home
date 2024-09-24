import axios from 'axios';
// Carga la URL base desde las variables de entorno
const API_URL = import.meta.env.VITE_API_URL;

// Configura una instancia de Axios
const api = axios.create({
  baseURL: API_URL, // URL base según el entorno
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicio de login
const login = async (username, password) => {
  try {
    // Realiza la solicitud POST con Axios
    const response = await api.post('/users/login', {
      username,
      password,
    });

    // Axios maneja automáticamente el parsing del JSON
    return response.data.token;
  } catch (error) {
    // Manejo de errores
    if (error.response) {
      // Respuesta del servidor con código de error (4xx, 5xx)
      console.error('Error en la respuesta del servidor:', error.response.data);
      throw new Error('Error al iniciar sesión: ' + error.response.data.message);
    } else if (error.request) {
      // No hubo respuesta del servidor
      console.error('No hubo respuesta del servidor:', error.request);
      throw new Error('Error de red o el servidor no está disponible');
    } else {
      // Otro tipo de error
      console.error('Error en la solicitud:', error.message);
      throw new Error('Error inesperado al iniciar sesión');
    }
  }
};

// Servicio de logout
const logout = () => {
  return window.confirm('¿Estás seguro de que deseas cerrar sesión?');
};

export default { login, logout };
