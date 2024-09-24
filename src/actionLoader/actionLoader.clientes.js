// clieactionLoader.clientes.js
// import axios from 'axios'
import { getContacts } from '../services/clients.service.js'

// Carga la lista de contactos con un filtro opcional basado en la búsqueda (query)
// export async function loader({ request }) {
//   const url = new URL(request.url);
//   const query = url.searchParams.get('search') || ''; // Obtiene el parámetro 'search' de la URL, si existe
//   try {
//     const contacts = await getContacts(query); // Llama a la función getContacts con el query
//     return { contacts }; // Retorna los contactos como parte de los datos del loader
//   } catch (error) {
//     throw new Response("Error al cargar los contactos", { status: 500 });
//   }
// }
// import { getContacts } from '../services/clients.service.js';

export async function loader() {
  const clients = await getContacts();
  return clients;
}
