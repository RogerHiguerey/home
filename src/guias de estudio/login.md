# Guía de Estudio: Autenticación en React con Zustand

## 1. LoginView.jsx

Este componente maneja la vista de inicio de sesión y la lógica asociada.

### Importaciones
```javascript
import { useState, useEffect } from 'react';
import { useNavigate }  from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import Modal  from '../components/modals/Modal.jsx';
import Button from '../components/button/Button.jsx';
```
- Se importan hooks de React (useState, useEffect) y react-router-dom (useNavigate).
- Se importa useAuthStore desde el archivo de la tienda de autenticación.
- Se importan componentes Modal y Button.

### Estado Local
```javascript
const [credentials, setCredentials] = useState({ username: '', password: '' });
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
```
- `credentials`: Objeto que almacena el nombre de usuario y la contraseña.
- `loading`: Booleano que indica si se está procesando la solicitud de inicio de sesión.
- `error`: String que almacena mensajes de error.

### Hooks y Estado Global
```javascript
const { token, login } = useAuthStore(); 
const navigate = useNavigate();
```
- Se extraen `token` y `login` del store de autenticación usando useAuthStore.
- `navigate` es una función de react-router-dom para la navegación programática.

### Efectos
```javascript
useEffect(() => {
  console.log("Token:", token)
  if (token) navigate('/dashboard');
}, [token, navigate]);
```
- Este efecto se ejecuta cuando cambia `token` o `navigate`.
- Si existe un token, redirige al usuario al dashboard.

### Manejo de Eventos
```javascript
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setCredentials({ ...credentials, [name]: value });
};
```
- Actualiza el estado `credentials` cuando el usuario escribe en los campos de entrada.

```javascript
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
    const token = await fetchLogin(username, password);
    login(token); // Actualiza el estado de autenticación
    navigate('/dashboard'); // Redirige al dashboard
  } catch (error) {
    console.error(error)
    setError('Nombre de usuario o contraseña incorrectos. Intente de nuevo.');
  } finally {
    setLoading(false);
  }
};
```
- Maneja el envío del formulario de inicio de sesión.
- Valida que los campos no estén vacíos.
- Usa `fetchLogin` para hacer la solicitud de inicio de sesión.
- Si es exitoso, actualiza el estado global con `login(token)` y navega al dashboard.
- Si hay un error, actualiza el estado de error.

### Funciones Auxiliares
```javascript
const handleCloseModal = () => setError('');

const fetchLogin = async (username, password) => {
  const response = await fetch('https://api-pfxl.onrender.com/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Error al iniciar sesión');
  }

  const data = await response.json();
  return data.token;
};
```
- `handleCloseModal`: Limpia el estado de error al cerrar el modal.
- `fetchLogin`: Realiza la solicitud HTTP para el inicio de sesión.

### Renderizado
El componente renderiza un formulario con campos para nombre de usuario y contraseña, un botón de envío, y un modal para mostrar errores.

## 2. auth.jsx

Este archivo contiene la lógica de autenticación utilizando Zustand para el manejo del estado global.

### Importaciones y Configuración
```javascript
import { useEffect, useCallback } from 'react'
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
```
- Se importan hooks de React y funciones de Zustand.
- `persist` es un middleware de Zustand para persistencia de datos.
- `jwtDecode` se usa para decodificar tokens JWT.

### Creación del Store
```javascript
const useAuthStore = create(
  persist(
    (set, get) => ({
      // ... estado y acciones
    }),
    {
      name: 'auth-store',
      storage: {
        // ... configuración de almacenamiento
      },
    }
  )
);
```
- Se crea un store de Zustand con persistencia.
- El store contiene el estado de autenticación y métodos para manipularlo.

### Estado y Acciones
```javascript
{
  token: null,
  isAuthenticated: false,

  login: (token) => {
    set({ token, isAuthenticated: true });
  },

  logout: async () => {
    set({ token: null, isAuthenticated: false });
    return true;
  },

  refreshToken: async () => {
    // Lógica para refrescar el token
  },

  verifyToken: () => {
    // Lógica para verificar la validez del token
  }
}
```
- `token`: Almacena el token de autenticación.
- `isAuthenticated`: Indica si el usuario está autenticado.
- `login`: Actualiza el estado con el nuevo token.
- `logout`: Limpia el estado de autenticación.
- `refreshToken`: Placeholder para la lógica de refrescar el token.
- `verifyToken`: Verifica la validez del token actual.

### Hook de Inicialización
```javascript
const useInitializeAuth = () => {
  const verifyToken = useAuthStore(state => state.verifyToken);

  const memoizedVerifyToken = useCallback(() => {
    verifyToken();
  }, [verifyToken]);

  useEffect(() => {
    memoizedVerifyToken();
    const intervalId = setInterval(memoizedVerifyToken, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [memoizedVerifyToken]);
};
```
- Este hook se utiliza para inicializar y mantener el estado de autenticación.
- Verifica el token al montar el componente y cada 5 minutos.

## Flujo de Datos y Comportamiento

1. **Inicio de Sesión**:
   - El usuario ingresa credenciales en `LoginView`.
   - `handleLogin` valida los datos y llama a `fetchLogin`.
   - Si es exitoso, se llama a `login` del store, actualizando el estado global.
   - El usuario es redirigido al dashboard.

2. **Verificación de Autenticación**:
   - `useInitializeAuth` se utiliza en componentes de nivel superior.
   - Verifica periódicamente la validez del token.
   - Si el token expira, se llama a `logout`.

3. **Persistencia**:
   - El estado de autenticación se guarda en localStorage.
   - Permite mantener la sesión entre recargas de página.

4. **Manejo de Errores**:
   - Errores de inicio de sesión se muestran en un modal.
   - Tokens inválidos resultan en cierre de sesión automático.

## Conceptos Clave de React y Zustand

- **useState**: Maneja el estado local en componentes funcionales.
- **useEffect**: Ejecuta efectos secundarios en componentes.
- **useCallback**: Memoriza funciones para optimizar renderizados.
- **Zustand**: Biblioteca de manejo de estado global, más simple que Redux.
- **persist middleware**: Permite persistir el estado de Zustand en localStorage.

Esta guía proporciona una visión general del sistema de autenticación implementado. Para una comprensión más profunda, se recomienda estudiar cada parte del código en detalle y experimentar con modificaciones.