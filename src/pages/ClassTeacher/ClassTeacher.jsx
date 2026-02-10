import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../ClassTeacher/ClassTeacher.css';

const ClassTeacher = () => {
    const { classId } = useParams(); 
    const navigate = useNavigate();
    const [myClasses, setMyClasses] = useState([]); // ගුරුවරයාගේ සියලුම පන්ති
    const [announcements, setAnnouncements] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [newPost, setNewPost] = useState('');
    
    const getSession = () => {
        const session = localStorage.getItem('SKORATEAsession');
        if (!session) return null;
        try {
            return JSON.parse(session);
        } catch (e) {
            return session;
        }
    };

    const sessionData = getSession();
    const isTeacher = sessionData !== null;
    const teacherNumber = sessionData?.number || sessionData;

    useEffect(() => {
        if (teacherNumber && isTeacher) {
            fetchMyClasses();
        }
    }, [teacherNumber]);

    useEffect(() => {
        if (classId && classId !== "undefined") {
            fetchAnnouncements();
            fetchMaterials();
        }
    }, [classId]);

    // 🆕 ගුරුවරයාට අයිති පන්ති ලිස්ට් එක මෙතනින් ගන්නවා
    const fetchMyClasses = async () => {
        try {
            const res = await axios.get(`http://skora-backend-v2.vercel.app/teachers/my-classes/${teacherNumber}`);
            setMyClasses(res.data);
        } catch (err) {
            console.error("Error loading classes:", err);
        }
    };

    const fetchAnnouncements = async () => {
        try {
            const res = await axios.get(`http://skora-backend-v2.vercel.app/teachers/announcements/${classId}`);
            setAnnouncements(res.data);
        } catch (err) {
            console.error("Error loading announcements:", err);
        }
    };

    const fetchMaterials = async () => {
        try {
            const res = await axios.get(`http://skora-backend-v2.vercel.app/teachers/materials/${classId}`);
            setMaterials(res.data);
        } catch (err) {
            console.error("Error loading materials:", err);
        }
    };

    const handlePost = async () => {
        if (!newPost.trim()) return alert("Type something!");
        if (!classId || classId === "undefined") return alert("Please select a class first!");

        try {
            await axios.post('http://skora-backend-v2.vercel.app/teachers/add-announcement', {
                class_id: classId,
                content: newPost
            });
            setNewPost('');
            fetchAnnouncements();
            alert("Announcement posted successfully!");
        } catch (err) {
            alert("Failed to post.");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #333', paddingBottom: '10px' }}>
                <h2>🏫 Classroom {classId && `(ID: ${classId})`}</h2>
                
                {/* 🆕 පන්ති තෝරන්න පුළුවන් Dropdown එක */}
                {isTeacher && (
                    <select 
                        value={classId} 
                        onChange={(e) => navigate(`/classTeacher/${e.target.value}`)}
                        style={{ padding: '8px', borderRadius: '5px', border: '1px solid #007bff', fontWeight: 'bold' }}
                    >
                        <option value="">Select Your Class</option>
                        {myClasses.map(c => (
                            <option key={c.class_id} value={c.class_id}>
                                {c.class_name} (ID: {c.class_id})
                            </option>
                        ))}
                    </select>
                )}

                <span style={{ padding: '5px 10px', background: isTeacher ? '#d4edda' : '#eee', borderRadius: '5px' }}>
                    {isTeacher ? "👨‍🏫 Teacher Mode" : "🎓 Student View"}
                </span>
            </div>

            {isTeacher && (
                <div style={{ marginTop: '20px', marginBottom: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '10px', border: '1px solid #ddd' }}>
                    <h3>Add New Announcement for {classId ? `Class ${classId}` : '...'}</h3>
                    <textarea 
                        value={newPost} 
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="Write something to your students..."
                        style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '100px', fontSize: '16px', boxSizing: 'border-box' }}
                    />
                    <button 
                        onClick={handlePost}
                        disabled={!classId}
                        style={{ marginTop: '10px', padding: '10px 20px', background: classId ? '#007bff' : '#ccc', color: 'white', border: 'none', borderRadius: '5px', cursor: classId ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}
                    >
                        Post to Class
                    </button>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                <section>
                    <h3>📢 Announcements</h3>
                    {announcements.length > 0 ? (
                        announcements.map(a => (
                            <div key={a.id} style={{ background: '#fff', border: '1px solid #eee', padding: '15px', marginBottom: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                <p style={{ margin: '0 0 10px 0' }}>{a.content}</p>
                                <small style={{ color: '#888' }}>{new Date(a.created_at).toLocaleString()}</small>
                            </div>
                        ))
                    ) : <p style={{ color: '#888' }}>No announcements yet.</p>}
                </section>

                <section>
                    <h3>📚 Study Materials</h3>
                    {materials.length > 0 ? (
                        materials.map(m => (
                            <div key={m.id} style={{ background: '#f0f7ff', border: '1px solid #cce5ff', padding: '15px', marginBottom: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong style={{ display: 'block' }}>{m.title}</strong>
                                    <small style={{ color: '#666' }}>Type: {m.type}</small>
                                </div>
                                <a href={m.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>Open ↗</a>
                            </div>
                        ))
                    ) : <p style={{ color: '#888' }}>No materials shared yet.</p>}
                </section>
            </div>
        </div>
    );
};

export default ClassTeacher;