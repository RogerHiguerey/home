// ModalX.jsx
import PropTypes from 'prop-types';
import '../../styles/Modal.css'; // Estilo del modal

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null; // Si el modal no está abierto, no se muestra nada

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children} {/* Aquí se renderiza el contenido del modal */}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn-cerrar">Cerrar</button>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
};

export default Modal;
