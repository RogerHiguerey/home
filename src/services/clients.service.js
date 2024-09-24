// clients.service.js
import axios from 'axios'
// import { matchSorter } from "match-sorter";
// import sortBy from "sort-by";

export async function getContacts() {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    return response.data;
  } catch (error) {
    throw new Response("Error en la carga de usuarios", { status: error.response.status });
  }
}
// export async function getContacts(query) {
//   try {
//     const response = await axios.get('https://jsonplaceholder.typicode.com/users');
//     let users = response.data;

//     if (query) {
//       users = matchSorter(users, query, { keys: ["first", "last"] });
//     }

//     return users.sort(sortBy("last", "createdAt"));
//   } catch (error) {
//     throw new Response("Error en la carga de usuarios", { status: error.response ? error.response.status : 500 });
//   }
// }

export async function createContact() {
  await fakeNetwork();
  let id = Math.random().toString(36).substring(2, 9);
  let contact = { id, createdAt: Date.now() };
  let contacts = await getContacts();
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}

export async function getContact(id) {
  await fakeNetwork(`contact:${id}`);
  let contacts = await localforage.getItem("contacts");
  let contact = contacts.find(contact => contact.id === id);
  return contact ?? null;
}

export async function updateContact(id, updates) {
  await fakeNetwork();
  let contacts = await localforage.getItem("contacts");
  let contact = contacts.find(contact => contact.id === id);
  if (!contact) throw new Error("No contact found for", id);
  Object.assign(contact, updates);
  await set(contacts);
  return contact;
}

export async function deleteContact(id) {
  let contacts = await localforage.getItem("contacts");
  let index = contacts.findIndex(contact => contact.id === id);
  if (index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
}

function set(contacts) {
  return localforage.setItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

async function fakeNetwork(key) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise(res => {
    setTimeout(res, Math.random() * 800);
  });
}