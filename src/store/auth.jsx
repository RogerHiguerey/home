// auth.jsx
import { useEffect, useCallback } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

/**
 * Store de autenticación usando Zustand
 * 
 * Este store maneja el estado de autenticación de la aplicación,
 * incluyendo el token JWT, el estado de autenticación y funciones
 * para iniciar sesión, cerrar sesión y refrescar el token.
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      isAuthenticated: false,

      /**
       * Función para iniciar sesión
       * @param {string} token - El token JWT recibido del servidor
       */
      login: (token) => {
        set({ token, isAuthenticated: true });
      },

      /**
       * Función para cerrar sesión
       * @returns {Promise<boolean>} - Promesa que resuelve a true si el cierre de sesión fue exitoso
       */
      logout: async () => {
        set({ token: null, isAuthenticated: false });
        return true;
      },

      /**
       * Función para refrescar el token
       * TODO: Implementar la lógica para refrescar el token
       */
      refreshToken: async () => {
        // Implementación futura:
        // const response = await fetch('/api/refresh-token', { 
        //   method: 'POST', 
        //   headers: { 'Authorization': `Bearer ${get().token}` } 
        // });
        // if (response.ok) {
        //   const { newToken } = await response.json();
        //   set({ token: newToken, isAuthenticated: true });
        // } else {
        //   get().logout();
        // }
      },

      /**
       * Función para verificar la validez del token
       */
      verifyToken: () => {
        const token = get().token;
        console.log("Verificando token");
        if (token) {
          try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp && decoded.exp > currentTime) {
              set({ isAuthenticated: true });
              
              // Si el token expira en menos de 5 minutos, intenta refrescarlo
              if (decoded.exp - currentTime < 300) {
                get().refreshToken();
              }
            } else {
              get().logout();
            }
          } catch (error) {
            console.error("Error verificando el token:", error);
            get().logout();
          }
        } else {
          set({ isAuthenticated: false });
        }
      }
    }),
    {
      name: 'auth-store', // Nombre de la variable en LocalStorage
      storage: {
        getItem: (name) => {
          const storedValue = localStorage.getItem(name);
          return storedValue ? JSON.parse(storedValue) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);

/**
 * Hook para inicializar y mantener el estado de autenticación
 * 
 * Este hook verifica el token al montar el componente y cada 5 minutos.
 */
const useInitializeAuth = () => {
  const verifyToken = useAuthStore(state => state.verifyToken);

  const memoizedVerifyToken = useCallback(() => {
    verifyToken();
  }, [verifyToken]);

  useEffect(() => {
    memoizedVerifyToken();
    // Verifica el token cada 5 minutos
    const intervalId = setInterval(memoizedVerifyToken, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [memoizedVerifyToken]);
};

export { useAuthStore, useInitializeAuth };