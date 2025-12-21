// SessionModal.jsx
import "../styles/SessionModal.css";
import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Set the root element for accessibility

const SessionModal = ({ isOpen, onExtendSession, onLogout }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onLogout} // Close modal if clicked outside
      contentLabel="Session Expiration"
      className="session-modal"
      overlayClassName="session-modal-overlay"
      shouldCloseOnOverlayClick={false} // Prevent closing by clicking the overlay
      ariaHideApp={process.env.NODE_ENV !== "test"} // Disable accessibility checks in test environments
    >
      <div className="modal-content">
        <h2 className="modal-header">Session Timeout</h2>
        <p className="modal-message">
          Your session is about to expire. Would you like to extend it?
        </p>
        <div className="modal-actions">
          <button
            onClick={onExtendSession}
            className="modal-button extend-button"
          >
            Extend Session
          </button>
          <button onClick={onLogout} className="modal-button logout-button">
            Logout
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SessionModal;
