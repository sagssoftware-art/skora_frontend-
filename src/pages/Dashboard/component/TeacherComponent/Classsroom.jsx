import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Classroom.css';

const Classroom = () => {
    const { classId } = useParams(); // URL එකෙන් පන්තියේ ID එක ගන්නවා (e.g., /classroom/10)
    
    const [announcements, setAnnouncements] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [newNotice, setNewNotice] = useState('');
    const [matTitle, setMatTitle] = useState('');
    const [matLink, setMatLink] = useState('');
    const [isOwner, setIsOwner] = useState(false); // ටීචර්ට මේ පන්තිය අයිතිද කියලා බලන්න

    const teacherSession = JSON.parse(localStorage.getItem('SKORATEAsession'));
    const isTeacher = !!teacherSession;

    useEffect(() => {
        if (classId) {
            fetchAnnouncements();
            fetchMaterials();
            if (isTeacher) {
                checkOwnership();
            }
        }
    }, [classId]);

    // ටීචර්ට මේ පන්තිය අයිතිදැයි Backend එකෙන් පරීක්ෂා කිරීම
    const checkOwnership = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/teachers/my-classes/${teacherSession.number}`);
            // ටීචර්ගේ පන්ති ලැයිස්තුවේ මේ classId එක තියෙනවාද බලනවා
            const owns = res.data.some(c => c.class_id === parseInt(classId));
            setIsOwner(owns);
        } catch (err) {
            console.error("Ownership check failed", err);
        }
    };

    const fetchAnnouncements = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/teachers/announcements/${classId}`);
            setAnnouncements(res.data);
        } catch (err) { console.error("Error fetching announcements", err); }
    };

    const fetchMaterials = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/teachers/materials/${classId}`);
            setMaterials(res.data);
        } catch (err) { console.error("Error fetching materials", err); }
    };

    const handlePostNotice = async () => {
        if (!newNotice.trim()) return;
        try {
            // මෙතනදී class_id එක විදිහට යන්නේ දැනට විවෘත කරලා තියෙන පන්තියේ ID එකයි
            await axios.post('http://localhost:3000/teachers/add-announcement', {
                class_id: classId, 
                content: newNotice
            });
            setNewNotice('');
            fetchAnnouncements();
        } catch (err) { alert("Error posting notice"); }
    };

    const handlePostMaterial = async () => {
        if (!matTitle || !matLink) return alert("Please fill all fields");
        try {
            await axios.post('http://localhost:3000/teachers/add-material', {
                class_id: classId,
                title: matTitle,
                link: matLink,
                type: 'resource'
            });
            setMatTitle(''); setMatLink('');
            fetchMaterials();
        } catch (err) { alert("Error adding material"); }
    };

    const ensureHttps = (url) => {
        if (!url) return "#";
        return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    };

    return (
        <div className="classroom-container">
            <header className="class-header">
                <div className="header-content">
                    <h1>🎓 Classroom Dashboard</h1>
                    <div className="badge-container">
                        <span className="class-id-badge">Class ID: #{classId}</span>
                        <span className={`role-badge ${isTeacher ? 'teacher' : 'student'}`}>
                            {isTeacher ? `👨‍🏫 ${teacherSession.fullname}` : "🎓 Student View"}
                        </span>
                    </div>
                </div>
            </header>

            <div className="class-grid">
                {/* 1. Announcements */}
                <section className="notice-board">
                    <div className="section-title">
                        <h3>📢 Announcements</h3>
                        <p>Latest updates for this specific class</p>
                    </div>
                    
                    {/* ටීචර් නම් සහ මේ පන්තිය එයාගේ නම් විතරක් පෝස්ට් box එක පෙන්වයි */}
                    {isTeacher && isOwner && (
                        <div className="post-card">
                            <textarea 
                                placeholder="Write an announcement for this class..." 
                                value={newNotice}
                                onChange={(e) => setNewNotice(e.target.value)}
                            />
                            <button className="post-btn" onClick={handlePostNotice}>Send to Students</button>
                        </div>
                    )}

                    <div className="notice-list">
                        {announcements.map(a => (
                            <div key={a.id} className="notice-item premium-card">
                                <p>{a.content}</p>
                                <small>Posted: {new Date(a.created_at).toLocaleString()}</small>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 2. Materials */}
                <section className="materials-section">
                    <div className="section-title">
                        <h3>📚 Study Resources</h3>
                    </div>

                    {isTeacher && isOwner && (
                        <div className="post-card material-form">
                            <input type="text" placeholder="Title" value={matTitle} onChange={(e) => setMatTitle(e.target.value)} />
                            <input type="text" placeholder="Link" value={matLink} onChange={(e) => setMatLink(e.target.value)} />
                            <button className="add-mat-btn" onClick={handlePostMaterial}>Add to Class</button>
                        </div>
                    )}

                    <div className="material-list">
                        {materials.map(m => (
                            <div key={m.id} className="material-item premium-card">
                                <strong>{m.title}</strong>
                                <a href={ensureHttps(m.link)} target="_blank" rel="noopener noreferrer" className="view-btn">View</a>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Classroom;