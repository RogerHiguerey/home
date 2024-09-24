// Modal.jsx
import PropTypes from 'prop-types';
import '../../styles/Modal.css'; 

const Modal = ({ title, message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onClose} className="modal-close-button">Cerrar</button>
      </div>
    </div>
  );
};

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
