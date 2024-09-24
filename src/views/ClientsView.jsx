import { Outlet, NavLink, useLoaderData } from 'react-router-dom';

const ClientsView = () => {
  const clients = useLoaderData();

  if (!clients) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="clients-view">
      <h2>Clientes</h2>
      <ul>
        {clients.map(client => (
          <li key={client.id}>
            <NavLink to={`/dashboard/clients/${client.id}`}>
              {client.name} - {client.email}
            </NavLink>
          </li>
        ))}
      </ul>
      <Outlet />
    </div>
  );
};

export default ClientsView;
