import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './Button';
import Card from './Card';
import './TeacherHero.css';

const TeacherHero = () => {
    const [allServers, setAllServers] = useState([]);
    const [joinedServers, setJoinedServers] = useState([]);
    const [myClassId, setMyClassId] = useState(null);
    const [newClassName, setNewClassName] = useState({}); 
    const [studentRequests, setStudentRequests] = useState([]); // 🆕 අලුත් එකතු කිරීම

    const getTeacherNumber = () => {
        const session = localStorage.getItem('SKORATEAsession');
        if (!session) return null;
        try {
            const parsed = JSON.parse(session);
            return parsed.number || parsed; 
        } catch (e) {
            return session;
        }
    };

    const teacherNumber = getTeacherNumber();

    useEffect(() => {
        if (teacherNumber) {
            fetchAllServers();
            fetchMyPermissions();
            fetchTeacherClass();
            fetchStudentRequests(); // 🆕 ඉල්ලීම් ටික ලෝඩ් කරන්න
        }
    }, [teacherNumber]);

    const fetchTeacherClass = async () => {
        try {
            const res = await axios.get(`http://skora-backend-v2.vercel.app/teachers/my-class-id/${teacherNumber}`);
            if (res.data && res.data.class_id) {
                setMyClassId(res.data.class_id);
            }
        } catch (err) { console.error("Error fetching class ID:", err); }
    };

    // 🆕 ශිෂ්‍යයන් එවපු ඉල්ලීම් ටික ලබා ගැනීම
    const fetchStudentRequests = async () => {
        try {
            const res = await axios.get(`http://skora-backend-v2.vercel.app/teachers/student-requests/${teacherNumber}`);
            setStudentRequests(res.data || []);
        } catch (err) { console.error("Error fetching student requests", err); }
    };

    // 🆕 ඉල්ලීමක් Accept කිරීම
    const handleAction = async (requestId, action) => {
        try {
            await axios.post('http://skora-backend-v2.vercel.app/teachers/student-request-action', {
                request_id: requestId,
                status: action // 'accepted' හෝ 'rejected'
            });
            alert(`Student request ${action}!`);
            fetchStudentRequests(); // රිෆ්‍රෙෂ් කරන්න
        } catch (err) { alert("Action failed."); }
    };

    const fetchAllServers = async () => {
        try {
            const res = await axios.get('http://skora-backend-v2.vercel.app/server/all-servers');
            setAllServers(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchMyPermissions = async () => {
        try {
            const res = await axios.get(`http://skora-backend-v2.vercel.app/server/my-permissions/${teacherNumber}`);
            setJoinedServers(res.data || []);
        } catch (err) { console.error(err); }
    };

    const handleJoinRequest = async (serverId) => {
        try {
            await axios.post('http://skora-backend-v2.vercel.app/server/join-request', {
                teacher_number: teacherNumber,
                server_id: serverId
            });
            alert("Join Request sent!");
            fetchMyPermissions();
        } catch (err) { alert("Failed to send request."); }
    };

    const handleCreateClass = async (serverId) => {
        const className = newClassName[serverId];
        if (!className) return alert("Please enter a class name");
        try {
            const res = await axios.post('http://skora-backend-v2.vercel.app/teachers/create-class', {
                class_name: className,
                teacher_number: teacherNumber,
                server_id: serverId
            });
            if (res.data.success) {
                alert("Class created successfully!");
                setNewClassName({ ...newClassName, [serverId]: '' });
                fetchTeacherClass();
            }
        } catch (err) { alert("Error creating class."); }
    };

    const getServerStatus = (serverId) => {
        const found = joinedServers.find(s => s.server_id === serverId);
        return found ? found.status : 'none';
    };

    return (
        <div id="educator-hero-section">
            <div id="educator-hero-section-tools" style={{ 
                opacity: myClassId ? 1 : 0.4, 
                pointerEvents: myClassId ? 'all' : 'none' 
            }}>
                <div id="educator-tools-container">
                    <Button title="MY Space" abbrivation="Classroom" link={myClassId ? `/classTeacher/${myClassId}` : '#'} />  
                    <Button title="Reports" abbrivation="Grading" link={myClassId ? `/updateReports/${myClassId}` : '#'} />  
                    <Button title="Activities" abbrivation="Assignments" link={myClassId ? `/addAssignment/${myClassId}` : '#'} />
                </div>
            </div>

            <div id="account-status-educator">
                <Card name="Teacher Dashboard" />

                {/* 🆕 STUDENT REQUESTS SECTION (අලුතින් එක් කළ කොටස) */}
                <div id="student-requests-panel" style={{ marginTop: '20px', padding: '20px', background: '#f9f9f9', borderRadius: '12px', border: '1px solid #ddd' }}>
                    <h3>Pending Student Requests</h3>
                    {studentRequests.length === 0 ? <p>No pending requests.</p> : (
                        studentRequests.map(req => (
                            <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#fff', marginBottom: '5px', borderRadius: '8px', border: '1px solid #eee' }}>
                                <span><b>{req.student_name}</b> wants to join <b>{req.class_name}</b></span>
                                <div>
                                    <button onClick={() => handleAction(req.id, 'accepted')} style={{ marginRight: '5px', color: 'green' }}>Accept</button>
                                    <button onClick={() => handleAction(req.id, 'rejected')} style={{ color: 'red' }}>Reject</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                
                {/* SERVER DISCOVERY (ඔයාගේ කලින් කෝඩ් එක) */}
                <div id="server-discovery">
                    <h3>Explore Available Servers</h3>
                    <div className="discovery-grid">
                        {allServers.map(server => {
                            const status = getServerStatus(server.id);
                            return (
                                <div key={server.id} className="discovery-card" style={{ padding: '20px', border: '1px solid #ececec', borderRadius: '12px', marginBottom: '15px', background: '#fff' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h4 style={{ margin: 0 }}>{server.name}</h4>
                                            <small>Status: <b>{status.toUpperCase()}</b></small>
                                        </div>
                                        {status === 'none' && (
                                            <button onClick={() => handleJoinRequest(server.id)} style={{ padding: '8px 20px', borderRadius: '20px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>Join</button>
                                        )}
                                        {status === 'pending' && (
                                            <button disabled style={{ padding: '8px 20px', borderRadius: '20px', backgroundColor: '#ffc107', border: 'none' }}>Pending...</button>
                                        )}
                                    </div>

                                    {status === 'accepted' && (
                                        <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '15px', display: 'flex', gap: '10px' }}>
                                            <input type="text" placeholder="Enter Class Name" value={newClassName[server.id] || ''} onChange={(e) => setNewClassName({ ...newClassName, [server.id]: e.target.value })} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
                                            <button onClick={() => handleCreateClass(server.id)} style={{ backgroundColor: '#28a745', color: 'white', padding: '10px 20px', borderRadius: '6px', border: 'none' }}>Create</button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherHero;