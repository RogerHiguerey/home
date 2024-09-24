import { useLoaderData } from 'react-router-dom';

const ClientDetail = () => {
  const client = useLoaderData();

  if (!client) {
    return <div>Cargando detalles del cliente...</div>;
  }

  return (
    <div className="client-detail">
      <h3>Detalles de {client.name}</h3>
      <p>Email: {client.email}</p>
      <p>Teléfono: {client.phone}</p>
      <p>Compañía: {client.company.name}</p>
      <p>Dirección: {client.address.street}, {client.address.city}</p>
    </div>
  );
};

export default ClientDetail;
