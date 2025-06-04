// Modal.jsx
import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, message, status = 'success' }) => {
  // We no longer return null here. The modal-overlay will always be in the DOM
  // but its visibility will be controlled by the 'open' class via CSS.

  // Choose icon based on status
  const iconSvg = status === 'success' ? (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#34d399" // Will be overridden by CSS variable
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ) : (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#DB1A66" // Will be overridden by CSS variable
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );

  return (
    // Add the 'open' class based on isOpen state
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      {/* Prevent clicks on the modal content from closing the modal */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className={`modal-icon modal-icon-${status}`}>
          {iconSvg}
        </div>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <button className="modal-button" onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default Modal;