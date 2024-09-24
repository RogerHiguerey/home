// ClientView.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useTable, usePagination } from 'react-table';
import axios from 'axios';
// import Modal from 'react-modal';
import { useAuthStore } from '../store/auth.jsx';
import Modal from '../components/modals/ModalX.jsx'
// Archivo para estilos personalizados
import '../styles/ClientView.css'; 

const ClientView = () => {
  // Estados
  const [clientes, setClientes] = useState([]); // Almacena la lista de clientes
  const [loading, setLoading] = useState(true); // Controla el estado de carga
  const [error, setError] = useState(null); // Almacena errores
  const [isModalOpen, setModalOpen] = useState(false); // Controla la visibilidad del modal
  const [modalContent, setModalContent] = useState(null); // Almacena el contenido dinámico del modal
  const { token } = useAuthStore(); // Obtenemos el token de autenticación desde el store
  
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  // const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    status: '' 
  });

  // Función para obtener la lista de clientes desde el servidor
  const fetchClientes = useCallback(async () => {
    if (!token) { // Verifica que el token exista
      setError('No hay token de autenticación');
      setLoading(false);
      return;
    }

    try {
      const headers = { 'Authorization': `Bearer ${token}`, }; // Pasamos el token en el header
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/clients`, { headers });
      setClientes(response.data); // Guardamos los clientes en el estado
    } catch (err) {
      setError('Error al cargar los clientes: ' + err.message); // Guardamos el error en el estado
    } finally {
      setLoading(false); // Cambiamos el estado de carga a false
    }
  }, [token]);
  
  // Ejecuta fetchClientes cuando el componente se monta
  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  // Handle opening of modal for edit or add
  const openFormModal = (client = null) => {
    setSelectedClient(client);
    if (client) {
      setFormData({ ...client });
    } else {
      setFormData({ name: '', email: '', phone: '', status: '' });
    }
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => setIsFormModalOpen(false);

  // Handle the deletion modal
  const openDeleteModal = (client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/clients/${selectedClient.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientes((prev) => prev.filter((c) => c.id !== selectedClient.id));
    } catch (err) {
      setError('Error al eliminar cliente: ' + err.message);
    } finally {
      closeDeleteModal();
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      if (selectedClient) {
        // Editing existing client
        await axios.put(`${import.meta.env.VITE_API_URL}/api/clients/${selectedClient.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClientes((prev) =>
          prev.map((c) => (c.id === selectedClient.id ? { ...c, ...formData } : c))
        );
      } else {
        // Adding new client
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/clients`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClientes((prev) => [...prev, response.data]);
      }
    } catch (err) {
      setError('Error al guardar cliente: ' + err.message);
    } finally {
      closeFormModal();
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Nombre',
        accessor: 'name',
      },
      {
        Header: 'Correo electrónico',
        accessor: 'email',
      },
      {
        Header: 'Teléfono',
        accessor: 'phone',
      },
      {
        Header: 'Estado',
        accessor: 'status',
      },
      {
        Header: 'Acciones',
        accessor: 'acciones',
        Cell: ({ row }) => (
          <div className="action-buttons">
            <button onClick={() => openFormModal(row.original)} className="edit-btn">Editar</button>
            <button onClick={() => openDeleteModal(row.original)} className="delete-btn">Eliminar</button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex },
    prepareRow,
  } = useTable(
    {
      columns,
      data: clientes,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    usePagination
  );

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} key={column.id}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} key={cell.column.id}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Anterior
        </button>
        <span>
          Página{' '}
          <strong>
            {pageIndex + 1} de {pageOptions.length}
          </strong>{' '}
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Siguiente
        </button>
      </div>
      <div>
        <button onClick={() => openFormModal(null)} className="add-btn">Agregar cliente</button>
      </div>

      {/* Modal para eliminar */}
      <Modal isOpen={isDeleteModalOpen} onRequestClose={closeDeleteModal}>
        <h2>Confirmar eliminación</h2>
        <p>¿Estás seguro que deseas eliminar a {selectedClient?.name}?</p>
        <button onClick={handleDelete} className="confirm-delete-btn">Eliminar</button>
        <button onClick={closeDeleteModal} className="cancel-btn">Cancelar</button>
      </Modal>

      {/* Modal para agregar/editar */}
      <Modal isOpen={isFormModalOpen} onRequestClose={closeFormModal}>
        <h2>{selectedClient ? 'Editar Cliente' : 'Agregar Cliente'}</h2>
        <form onSubmit={handleEdit}>
          <label>Nombre:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <label>Teléfono:</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <label>Estado:</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
          <button type="submit" className="save-btn">
            {selectedClient ? 'Guardar cambios' : 'Agregar'}
          </button>
        </form>
        <button onClick={closeFormModal} className="cancel-btn">Cancelar</button>
      </Modal>
    </div>
  );
};

export default ClientView;
