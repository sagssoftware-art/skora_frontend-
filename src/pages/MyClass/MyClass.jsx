import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MyClass.css';

const MyClass = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [allClasses, setAllClasses] = useState([]); 
    const [filteredClasses, setFilteredClasses] = useState([]); 
    const [myJoinedClasses, setMyJoinedClasses] = useState([]);
    const [myRequests, setMyRequests] = useState([]); 
    
    const navigate = useNavigate();
    const studentId = localStorage.getItem('SKORASTUsession'); 

    useEffect(() => {
        if (studentId) {
            fetchMyClasses();
            fetchAllClasses();
            fetchMyRequests();
        }
    }, [studentId]);

    // 1. දැනටමත් Enroll වී ඇති පන්ති ලබා ගැනීම
    const fetchMyClasses = async () => {
        try {
            const res = await axios.get(`http://skora-backend-v2.vercel.app/students/my-classes/${studentId}`);
            setMyJoinedClasses(res.data);
        } catch (err) { console.error("Error fetching joined classes"); }
    };

    // 2. යවා ඇති සියලුම Requests ලබා ගැනීම (Pending/Status බැලීමට)
    const fetchMyRequests = async () => {
        try {
            const res = await axios.get(`http://skora-backend-v2.vercel.app/students/my-requests/${studentId}`);
            setMyRequests(res.data);
        } catch (err) { console.error("Error fetching requests"); }
    };

    // 3. පද්ධතියේ ඇති සියලුම පන්ති Discovery සඳහා ලබා ගැනීම
    const fetchAllClasses = async () => {
        try {
            const res = await axios.get(`http://skora-backend-v2.vercel.app/students/search-classes`);
            setAllClasses(res.data);
            setFilteredClasses(res.data); 
        } catch (err) { console.error("Error fetching all classes"); }
    };

    // 4. Search කිරීමේ පහසුකම
    const handleSearch = (e) => {
        const val = e.target.value.toLowerCase();
        setSearchTerm(val);
        const filtered = allClasses.filter(cls => 
            cls.class_name.toLowerCase().includes(val) || 
            cls.server_name.toLowerCase().includes(val)
        );
        setFilteredClasses(filtered);
    };

    // 5. පන්තියකට සම්බන්ධ වීමට Request එකක් යැවීම
    const joinClass = async (classData) => {
        if (myJoinedClasses.length >= 5) return alert("Limit Reached (Max 5 Classes)!");
        try {
            const res = await axios.post('http://skora-backend-v2.vercel.app/students/join-class-request', {
                student_id: studentId,
                class_id: classData.class_id,
                teacher_number: classData.teacher_number
            });
            if (res.data.success) {
                alert("Join Request Sent Successfully!");
                fetchMyRequests();
            } else {
                alert(res.data.message);
            }
        } catch (err) { alert("Server Error"); }
    };

    return (
        <div id="student-class-wrapper" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px', fontFamily: 'Roboto, sans-serif' }}>
            
            {/* Header with Search Bar */}
            <div className="glass-header" style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '30px', maxWidth: '1000px', margin: '0 auto 30px auto' }}>
                <h2 style={{ color: '#1a73e8', marginBottom: '15px', fontWeight: '400' }}>🔍 Classroom Discovery</h2>
                <input 
                    type="text" 
                    placeholder="Search by Class or School..." 
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #dadce0', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }}
                />
            </div>

            {/* Classes Grid */}
            <div className="results-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                {filteredClasses.map(cls => {
                    // Logic to find status
                    const isJoined = myJoinedClasses.some(c => c.class_id === cls.class_id);
                    const isPending = myRequests.some(r => r.class_id === cls.class_id && r.status === 'pending');
                    
                    return (
                        <div key={cls.class_id} className="premium-card" style={{ 
                            background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #dadce0',
                            transition: 'transform 0.2s',
                            boxShadow: isJoined ? '0 4px 12px rgba(26, 115, 232, 0.12)' : 'none'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <span style={{ fontSize: '24px' }}>{isJoined ? '✅' : '📖'}</span>
                                {isJoined && <span style={{ fontSize: '10px', background: '#e8f0fe', color: '#1967d2', padding: '3px 10px', borderRadius: '12px', fontWeight: 'bold' }}>JOINED</span>}
                            </div>

                            <h4 style={{ margin: '0 0 5px 0', color: '#202124', fontSize: '18px' }}>{cls.class_name}</h4>
                            <p style={{ fontSize: '14px', color: '#5f6368', marginBottom: '20px' }}>🏫 {cls.server_name}</p>
                            
                            {/* Enrollment Status අනුව Button එක වෙනස් වේ */}
                            {isJoined ? (
                                <button 
                                    onClick={() => navigate(`/classroom/${cls.class_id}`)}
                                    style={{ 
                                        width: '100%', padding: '12px', borderRadius: '8px', cursor: 'pointer',
                                        backgroundColor: '#1a73e8', color: '#fff', border: 'none', fontWeight: '500'
                                    }}
                                >
                                    Enter Classroom
                                </button>
                            ) : (
                                <button 
                                    onClick={() => joinClass(cls)}
                                    disabled={isPending}
                                    style={{ 
                                        width: '100%', padding: '12px', borderRadius: '8px', 
                                        cursor: isPending ? 'not-allowed' : 'pointer',
                                        backgroundColor: isPending ? '#f1f3f4' : '#fff',
                                        color: isPending ? '#70757a' : '#1a73e8',
                                        border: isPending ? '1px solid #dadce0' : '1px solid #1a73e8',
                                        fontWeight: '500'
                                    }}
                                >
                                    {isPending ? '⏳ Waiting Approval' : 'Send Join Request'}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyClass;