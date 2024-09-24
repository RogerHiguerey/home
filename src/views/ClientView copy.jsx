// ClientView.jsx
import { useState, useEffect, useCallback } from 'react';
import { useTable , usePagination} from 'react-table'; // Para manejo de tablas
import { 
  Outlet, 
  NavLink, 
  useLoaderData, 
  Form, 
  useNavigation, 
  useSubmit 
} from "react-router-dom";
import axios from 'axios'; // Para realizar peticiones HTTP
import { useAuthStore } from '../store/auth.jsx'; // Para obtener el token de autenticación
import Modal from '../components/modals/ModalX.jsx'; // Componente Modal reutilizable
import Button from '../components/button/Button.jsx'; // Componente Button reutilizable
import '../styles/ClientView.css'; // Estilos específicos para el cliente

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
          headers: { Authorization: `Bearer ${token}`, },
        }
      );
      setClientes((prevClientes) => [...prevClientes, response.data]);
      setModalOpen(false); // Cerramos el modal
      setFormData({ name: '', email: '', phone: '' }); // Limpiamos el formulario
    } catch (err) {
      setError('Error al cargar los clientes: ' + err.message); // Guardamos el error en el estado
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
            <input type="text" name="name" placeholder="Nombre del cliente"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Correo electrónico</label>
            <input type="email" name="email" placeholder="Correo del cliente"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Teléfono</label>
            <input type="text" name="phone" placeholder="Teléfono del cliente"
              value={formData.phone}
              onChange={handleInputChange}
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
      const response = await axios.put(`/api/clientes/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}`, },
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
      setError('Error al cargar los clientes: ' + err.message); // Guardamos el error en el estado
    }
  };

  // Función para abrir el modal de confirmación para eliminar un cliente
  const handleDelete = (cliente) => {
    setModalContent({
      title: 'Eliminar Cliente',
      body: (
        <div>
          <p>¿Estás seguro de que deseas eliminar al cliente {cliente.name}?</p>
          <button 
            onClick={() => confirmDelete(cliente)} 
            className="btn-confirmar">
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
      await axios.delete(`/api/clientes/${cliente.id}`, {headers: { Authorization: `Bearer ${token}`}});
      setClientes((prevClientes) => prevClientes.filter((c) => c.id !== cliente.id)); // Eliminamos el cliente del estado
      setModalOpen(false); // Cerramos el modal
    } catch (err) {
      setError('Error al cargar los clientes: ' + err.message); // Guardamos el error en el estado
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
        Header: 'Estado',
        accessor: 'status', // Accedemos a la propiedad 'status' del cliente
      },
      {
        Header: 'Acciones',
        accessor: 'acciones',
        Cell: ({ row }) => (
          <div className="action-buttons">
            {/* Botones para editar y eliminar */}
            <button onClick={() => handleEdit(row.original)} className="edit-btn">Editar</button>
            <button onClick={() => handleDelete(row.original)} className="delete-btn">Eliminar</button>
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
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    usePagination
  );

  return (
    <div>
      <Button 
        type="button" 
        variant="primary" 
        size="medium" 
        onClick={() => setModalContent({
          title: 'Agregar Cliente',
          body: (
            <form onSubmit={handleAdd}>
              <div>
                <label>Nombre</label>
                <input type="text" name="name" placeholder="Nombre del cliente"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Correo electrónico</label>
                <input type="email" name="email" placeholder="Correo del cliente"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Teléfono</label>
                <input type="text" name="phone" placeholder="Teléfono del cliente"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="btn-guardar">Guardar</button>
            </form>
          )
        })} 
      >
        Agregar Cliente
      </Button>
      <button 
        className="btn-agregar" 
        onClick={() => setModalContent({
          title: 'Agregar Cliente',
          body: (
            <form onSubmit={handleAdd}>
              <div>
                <label>Nombre</label>
                <input type="text" name="name" placeholder="Nombre del cliente"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Correo electrónico</label>
                <input type="email" name="email" placeholder="Correo del cliente"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Teléfono</label>
                <input type="text" name="phone" placeholder="Teléfono del cliente"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="btn-guardar">Guardar</button>
            </form>
          )
        })} 
      >
        Agregar Cliente
      </button>

      {loading && <p>Cargando clientes...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Tabla de clientes */}
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
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>Anterior</button>
        <span> Página {' '} <strong>{pageIndex + 1} de {pageOptions.length}</strong> {' '} </span>
        <button onClick={() => nextPage()} disabled={!canNextPage}>Siguiente</button>
      </div>
      {/* <div>
        <button onClick={() => openFormModal(null)} className="add-btn">Agregar cliente</button>
      </div> */}
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
