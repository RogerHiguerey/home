import { PropTypes } from 'prop-types';
import { Form, useLoaderData, useFetcher } from "react-router-dom";

export default function Contact() {
  // Cargar el contacto actual desde el loader
  const { contact } = useLoaderData();

  return (
    <div id="contact">
      {/* Imagen de perfil del contacto, usando un avatar predeterminado si no hay */}
      <div>
        <img
          key={contact.avatar}
          src={contact.avatar || `https://robohash.org/${contact.id}.png?size=200x200`}
          alt={`${contact.first || contact.last}'s avatar`}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>Sin Nombre</i>
          )}{" "}
          {/* Componente de favoritos */}
          <Favorite contact={contact} />
        </h1>

        {/* Mostrar Twitter si existe */}
        {contact.twitter && (
          <p>
            <a target="_blank" rel="noopener noreferrer" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        )}

        {/* Notas del contacto */}
        {contact.notes && <p>{contact.notes}</p>}

        {/* Botones de edición y eliminación */}
        <div>
          {/* Formulario para editar el contacto */}
          <Form action="edit">
            <button type="submit">Editar</button>
          </Form>

          {/* Formulario para eliminar el contacto con confirmación */}
          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              if (!confirm("Por favor, confirma que deseas eliminar este registro.")) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Eliminar</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

// Componente de Favoritos
function Favorite({ contact }) {
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remover de favoritos" : "Agregar a favoritos"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}

// Validación de propiedades
Favorite.propTypes = {
  contact: PropTypes.shape({
    id: PropTypes.number.isRequired,
    first: PropTypes.string,
    last: PropTypes.string,
    twitter: PropTypes.string,
    avatar: PropTypes.string,
    notes: PropTypes.string,
    favorite: PropTypes.bool
  }).isRequired
};
