import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PrincipalHero.css';

const PrincipalHero = () => {
    const [serverStats, setServerStats] = useState([]);
    const [requests, setRequests] = useState([]); // Pending requests සඳහා
    const [newServerName, setNewServerName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    
    const adminNumber = localStorage.getItem('SKORAPRINsession');

    useEffect(() => {
        if (adminNumber) {
            fetchStats();
            fetchPendingRequests();
        }
    }, [adminNumber]);

    const fetchStats = async () => {
        try {
            const res = await axios.get(`http://skora-backend-v2.vercel.app/principal/server-stats/${adminNumber}`);
            setServerStats(res.data);
        } catch (err) {
            console.error("Error fetching stats:", err);
        }
    };

    const fetchPendingRequests = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/principal/requests/${adminNumber}`);
            setRequests(res.data);
        } catch (err) {
            console.error("Error fetching requests:", err);
        }
    };

    const handleAction = async (requestId, action) => {
        try {
            await axios.post('http://localhost:3000/principal/handle-request', {
                id: requestId,
                action: action 
            });
            fetchPendingRequests();
            fetchStats(); 
            alert(`Teacher request ${action}!`);
        } catch (err) {
            alert("Action failed!");
        }
    };

    const handleCreateServer = async (e) => {
        e.preventDefault();
        if (!newServerName) return alert("Please enter a server name");
        
        setIsCreating(true);
        try {
            const check = await axios.get(`http://localhost:3000/server/check/${newServerName}`);
            if (check.data.available) {
                const res = await axios.post('http://localhost:3000/server/create', {
                    name: newServerName,
                    admin: adminNumber
                });
                if (res.data.success) {
                    alert("SKOPRO Server Created!");
                    setNewServerName('');
                    fetchStats();
                }
            } else {
                alert("Server name already taken!");
            }
        } catch (err) {
            alert("Error creating server");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div id="principal-hero-wrapper">
            <div id="principal-header">
                <h2>🏫 Principal Control Center</h2>
                <p>Manage and monitor your SKOPRO infrastructure.</p>
            </div>

            {/* --- 🔔 Pending Teacher Requests Section --- */}
            {requests.length > 0 && (
                <div id="teacher-requests-container">
                    <h3>🔔 Pending Teacher Requests ({requests.length})</h3>
                    <div className="requests-list">
                        {requests.map(req => (
                            <div key={req.id} className="request-card">
                                <div className="req-info">
                                    <span className="req-teacher">Teacher ID: <strong>{req.teacher_number}</strong></span>
                                    <span className="req-server">Wants to join: <strong>{req.server_name}</strong></span>
                                </div>
                                <div className="req-btns">
                                    <button className="acc-btn" onClick={() => handleAction(req.id, 'accepted')}>Accept</button>
                                    <button className="rej-btn" onClick={() => handleAction(req.id, 'rejected')}>Decline</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- Create Server Section (OLD FEATURE KEPT) --- */}
            <div id="create-server-inline-card">
                <div className="card-content">
                    <h3>Deploy New Server</h3>
                    <p>Enter a unique name to start a new institutional gateway.</p>
                    <form onSubmit={handleCreateServer} className="inline-form">
                        <input 
                            type="text" 
                            placeholder="Enter Server Name" 
                            value={newServerName}
                            onChange={(e) => setNewServerName(e.target.value)}
                        />
                        <button type="submit" disabled={isCreating}>
                            {isCreating ? 'Deploying...' : 'Create Server'}
                        </button>
                    </form>
                </div>
            </div>

            <hr className="section-divider" />

            {/* --- Watch/Monitor Servers Section (OLD FEATURE KEPT) --- */}
            <h3 className="section-subtitle">Active Servers</h3>
            <div id="stats-grid">
                {serverStats.length > 0 ? serverStats.map(server => (
                    <div key={server.id} className="premium-server-card">
                        <div className="card-top">
                            <span className="live-indicator">● LIVE</span>
                            <h3>{server.name}</h3>
                            <span className="server-id-tag">ID: #{server.id}</span>
                        </div>
                        <div className="card-stats-row">
                            <div className="stat-box">
                                <span className="stat-value">{server.teacher_count || 0}</span>
                                <span className="stat-label">Educators</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-value">{server.class_count || 0}</span>
                                <span className="stat-label">Classes</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-value">Active</span>
                                <span className="stat-label">Status</span>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button className="manage-server-btn">Running Now</button>
                        </div>
                    </div>
                )) : (
                    <div className="no-server-msg">
                        <p>No active servers found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrincipalHero;