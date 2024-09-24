// ClientView.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useTable } from 'react-table'; // Para manejo de tablas
import axios from 'axios'; // Para realizar peticiones HTTP
import { useAuthStore } from '../store/auth.jsx'; // Para obtener el token de autenticación
import Modal from './Modal'; // Componente Modal reutilizable
import './ClientView.css'; // Estilos específicos para el cliente

const ClientView = () => {
  // Estados
  const [clientes, setClientes] = useState([]); // Almacena la lista de clientes
  const [loading, setLoading] = useState(true); // Controla el estado de carga
  const [error, setError] = useState(null); // Almacena errores
  const [isModalOpen, setModalOpen] = useState(false); // Controla la visibilidad del modal
  const [modalContent, setModalContent] = useState(null); // Almacena el contenido dinámico del modal
  const { token } = useAuthStore(); // Obtenemos el token de autenticación desde el store
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Función para obtener la lista de clientes desde el servidor
  const fetchClientes = useCallback(async () => {
    try {
      const response = await axios.get('/api/clientes', {
        headers: {
          Authorization: `Bearer ${token}`, // Pasamos el token en el header
        },
      });
      setClientes(response.data); // Guardamos los clientes en el estado
      setLoading(false); // Cambiamos el estado de carga a false
    } catch (err) {
      setError('Error al cargar los clientes'); // Guardamos el error en el estado
      setLoading(false); // Cambiamos el estado de carga a false
    }
  }, [token]);

  // Ejecuta fetchClientes cuando el componente se monta
  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  // Maneja cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Función para agregar un nuevo cliente
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        '/api/clientes',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setClientes((prevClientes) => [...prevClientes, response.data]);
      setModalOpen(false); // Cerramos el modal
      setFormData({ name: '', email: '', phone: '' }); // Limpiamos el formulario
    } catch (err) {
      setError('Error al agregar cliente');
    }
  };

  // Función para editar un cliente existente
  const handleEdit = (cliente) => {
    setFormData({
      name: cliente.name,
      email: cliente.email,
      phone: cliente.phone,
    });
    setModalContent({
      title: 'Editar Cliente',
      body: (
        <form onSubmit={(e) => handleUpdate(e, cliente.id)}>
          <div>
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nombre del cliente"
              required
            />
          </div>
          <div>
            <label>Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Correo del cliente"
              required
            />
          </div>
          <div>
            <label>Teléfono</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Teléfono del cliente"
              required
            />
          </div>
          <button type="submit" className="btn-guardar">Guardar Cambios</button>
        </form>
      ),
    });
    setModalOpen(true); // Abrimos el modal
  };

  // Función para actualizar un cliente
  const handleUpdate = async (e, id) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `/api/clientes/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setClientes((prevClientes) =>
        prevClientes.map((cliente) =>
          cliente.id === id ? response.data : cliente
        )
      );
      setModalOpen(false); // Cerramos el modal
      setFormData({ name: '', email: '', phone: '' }); // Limpiamos el formulario
    } catch (err) {
      setError('Error al actualizar el cliente');
    }
  };

  // Función para abrir el modal de confirmación para eliminar un cliente
  const handleDelete = (cliente) => {
    setModalContent({
      title: 'Eliminar Cliente',
      body: (
        <div>
          <p>¿Estás seguro de que deseas eliminar al cliente {cliente.name}?</p>
          <button onClick={() => confirmDelete(cliente)} className="btn-confirmar">
            Confirmar
          </button>
        </div>
      ),
    });
    setModalOpen(true); // Abrimos el modal
  };

  // Función para confirmar la eliminación del cliente
  const confirmDelete = async (cliente) => {
    try {
      await axios.delete(`/api/clientes/${cliente.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClientes((prevClientes) =>
        prevClientes.filter((c) => c.id !== cliente.id)
      ); // Eliminamos el cliente del estado
      setModalOpen(false); // Cerramos el modal
    } catch (err) {
      setError('Error al eliminar el cliente');
    }
  };

  // Columnas para la tabla de clientes
  const columns = React.useMemo(
    () => [
      {
        Header: 'Nombre',
        accessor: 'name', // Accedemos a la propiedad 'name' del cliente
      },
      {
        Header: 'Correo electrónico',
        accessor: 'email', // Accedemos a la propiedad 'email' del cliente
      },
      {
        Header: 'Teléfono',
        accessor: 'phone', // Accedemos a la propiedad 'phone' del cliente
      },
      {
        Header: 'Acciones',
        accessor: 'acciones',
        Cell: ({ row }) => (
          <div>
            {/* Botones para editar y eliminar */}
            <button onClick={() => handleEdit(row.original)} className="btn-editar">
              Editar
            </button>
            <button onClick={() => handleDelete(row.original)} className="btn-eliminar">
              Eliminar
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // Configuración de la tabla usando useTable
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: clientes });

  return (
    <div className="client-view-container">
      <button onClick={() => setModalContent({
        title: 'Agregar Cliente',
        body: (
          <form onSubmit={handleAdd}>
            <div>
              <label>Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nombre del cliente"
                required
              />
            </div>
            <div>
              <label>Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Correo del cliente"
                required
              />
            </div>
            <div>
              <label>Teléfono</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Teléfono del cliente"
                required
              />
            </div>
            <button type="submit" className="btn-guardar">Guardar</button>
          </form>
        )
      })} className="btn-agregar">
        Agregar Cliente
      </button>

      {loading && <p>Cargando clientes...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Tabla de clientes */}
      <table {...getTableProps()} className="clientes-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal para agregar/editar/eliminar */}
      {isModalOpen && <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent.title}
      >
        {modalContent.body}
      </Modal>}
    </div>
  );
};

export default ClientView;
