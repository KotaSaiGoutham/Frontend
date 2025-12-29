// Ensure this matches your src/components/BiometricPrompt.js
import React from 'react';
import LoginMobileModal from './customcomponents/Modal';
import { FaFingerprint } from 'react-icons/fa';

const BiometricPrompt = ({ isOpen, onClose, onEnable, onSkip }) => {
  return (
    <LoginMobileModal
      isOpen={isOpen}
      onClose={onClose} // Clicking background closes it (acts as skip usually)
      title="Enable Fast Login?"
      message="Would you like to use Face ID or Fingerprint for faster login next time?"
      status="info"
      // Modal.js will now render this div because of Step 1
      customContent={
        <div style={{ display: 'flex', gap: '15px', marginTop: '20px', justifyContent: 'center', width: '100%' }}>
          <button 
            onClick={onSkip}
            style={{ flex: 1, padding: '10px', background: '#e0e0e0', color: '#333', border: 'none', borderRadius: '8px', fontWeight: '600' }}
          >
            No, Thanks
          </button>
          <button 
            onClick={onEnable}
            style={{ flex: 1, padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600' }}
          >
            Enable
          </button>
        </div>
      }
    />
  );
};

export default BiometricPrompt;