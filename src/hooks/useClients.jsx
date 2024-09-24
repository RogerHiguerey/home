import { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; 
/**
 * Custom hook for managing client data and operations
 * @returns {Object} An object containing client data and CRUD operations
 */
const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches all clients from the API
   */
  const fetchClients = useCallback(async (username, password) => {
    setLoading(true);
    try {
      // Replace this with your actual API call
      // const response = await fetch('/api/clients');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/clients/login`,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      const data = await response.json();
      setClients(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Adds a new client
   * @param {Object} clientData - The data for the new client
   */
  const addClient = useCallback(async (clientData) => {
    try {
      // Replace this with your actual API call
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });
      if (!response.ok) {
        throw new Error('Failed to add client');
      }
      const newClient = await response.json();
      setClients(prevClients => [...prevClients, newClient]);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Updates an existing client
   * @param {string} id - The ID of the client to update
   * @param {Object} clientData - The updated data for the client
   */
  const updateClient = useCallback(async (id, clientData) => {
    try {
      // Replace this with your actual API call
      const response = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });
      if (!response.ok) {
        throw new Error('Failed to update client');
      }
      const updatedClient = await response.json();
      setClients(prevClients =>
        prevClients.map(client => client.id === id ? updatedClient : client)
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Deletes a client
   * @param {string} id - The ID of the client to delete
   */
  const deleteClient = useCallback(async (id) => {
    try {
      // Replace this with your actual API call
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete client');
      }
      setClients(prevClients => prevClients.filter(client => client.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Fetch clients when the component mounts
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
    loading,
    error,
    addClient,
    updateClient,
    deleteClient,
    refetchClients: fetchClients,
  };
};

export default useClients;