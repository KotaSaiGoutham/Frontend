import React from 'react';
import "../../pages/Modal.css"

const LoginMobileModal = ({ isOpen, onClose, title, message, status = 'success', customContent }) => {
  // Define Icon based on status
  const iconSvg = status === 'success' ? (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ) : status === 'info' ? (
    // Add an Info/Fingerprint style icon state
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <circle cx="12" cy="12" r="10" />
       <line x1="12" y1="16" x2="12" y2="12" />
       <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ) : (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#DB1A66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className={`modal-icon modal-icon-${status}`}>
          {iconSvg}
        </div>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        
        {/* --- FIX: Render custom buttons if provided, otherwise show OK --- */}
        {customContent ? (
           <div className="modal-custom-content">
             {customContent}
           </div>
        ) : (
           <button className="modal-button" onClick={onClose}>OK</button>
        )}
      </div>
    </div>
  );
};

export default LoginMobileModal;