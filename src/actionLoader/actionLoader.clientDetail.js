import axios from 'axios';

export async function loader({ params }) {
  const { clientId } = params;
  const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${clientId}`);
  return response.data;
}
