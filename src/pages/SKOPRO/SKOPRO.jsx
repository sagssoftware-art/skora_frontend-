import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SKORAPRO.css';

const SKOPRO = () => {
  const navigate = useNavigate();
  const [serverName, setServerName] = useState('');
  const [status, setStatus] = useState({ message: '', available: false });
  const [loading, setLoading] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);

  const checkValidity = async () => {
    if (!serverName) return setStatus({ message: 'Enter a name first!', available: false });
    setLoading(true);
    try {
      const response = await axios.get(`http://skora-backend-v2.vercel.app/server/check/${serverName}`);
      setStatus({ message: response.data.message, available: response.data.available });
    } catch (err) {
      setStatus({ message: 'Server connection error', available: false });
    } finally {
      setLoading(false);
    }
  };

  const createServer = async () => {
    const adminSession = localStorage.getItem('SKORAPRINsession');

    if (!adminSession) {
        alert("Session expired. Please login again.");
        navigate('/login');
        return;
    }

    try {
      const response = await axios.post('http://skora-backend-v2.vercel.app/server/create', {
        name: serverName,
        admin: adminSession
      });

      if (response.data.success) {
        setSuccessAlert(true);
        setTimeout(() => {
          navigate('/dashboard/principal');
        }, 2500);
      }
    } catch (err) {
      alert('Failed to create server. Please try again.');
    }
  };

  return (
    <div id="skopro-page-wrapper">
      {successAlert && (
        <div id="creation-success-overlay">
          <div className="success-modal">
            <div className="icon">🌿</div>
            <h2>Server Initialized!</h2>
            <p>Your server <strong>{serverName}</strong> is now linked to your account.</p>
            <p className="redirect-text">Redirecting to Dashboard...</p>
          </div>
        </div>
      )}

      <div id="create-sko-pro-server-main-container">
        <div id="page-title-container">
          <span id="animated-gradient-title">Setup Public server</span>
        </div>
        
        <div id="input-field-container">
          <input 
            type="text" 
            id="serverName" 
            placeholder='Create a name for server'
            value={serverName}
            onChange={(e) => {
                setServerName(e.target.value);
                setStatus({ message: '', available: false });
            }}
          />
          
          {status.message && (
            <div className={`status-alert ${status.available ? 'success' : 'error'}`}>
              {status.message}
            </div>
          )}

          <div className="btn-group">
            <button id="check-btn" onClick={checkValidity} disabled={loading}>
              {loading ? 'Validating...' : 'Check Validity'}
            </button>
            <button 
              id="create-btn" 
              onClick={createServer} 
              disabled={!status.available}
              className={status.available ? 'active-btn' : 'disabled-btn'}
            >
              Create Now
            </button>
          </div>
        </div>

        {/* Informational table and guidelines... */}
        <div id="setup-details-container">
            <div id="guidelines-text">
                <h3>Server Deployment Guidelines</h3>
                <p>Establishing a digital gateway for your institution via <strong>SKOPRO</strong>.</p>
                <p className="note">Admin Session: {localStorage.getItem('SKORAPRINsession') || 'Not Logged In'}</p>
            </div>
            {/* Table code from previous response remains the same */}
        </div>
      </div>
    </div>
  );
};

export default SKOPRO;