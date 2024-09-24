import PropTypes from 'prop-types';

const LogoutConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirmar Cierre de Sesión</h2>
        <p>¿Estás seguro de que quieres cerrar sesión?</p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="confirm-button">Salir</button>
          <button onClick={onCancel} className="cancel-button">Cancelar</button>
        </div>
      </div>
    </div>
  );
};

LogoutConfirmationModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default LogoutConfirmationModal;
