import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './viewAssignment.css'; // අපි කලින් හදපු Light Theme CSS එකම මෙතනටත් ගැලපෙනවා

const viewAssignment = () => {
    const [reports, setReports] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [studentInfo, setStudentInfo] = useState({ username: '', class_id: '' });
    const [loading, setLoading] = useState(true);

    const mobile = localStorage.getItem('SKORASTUsession');

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                // 1. ළමයාගේ විස්තර සහ Reports ගන්නවා
                const reportRes = await axios.get(`http://localhost:3000/students/my-full-reports/${mobile}`);
                setReports(reportRes.data.reports || []);
                
                // අපි හිතමු ළමයාගේ පන්තියත් මේ API එකෙන්ම එනවා කියලා
                const classId = reportRes.data.class_id || 'Not Assigned';
                setStudentInfo({ 
                    username: reportRes.data.username, 
                    class_id: classId 
                });

                // 2. පන්තියට අදාළ Assignments ගන්නවා
                if (classId !== 'Not Assigned') {
                    const assignRes = await axios.get(`http://localhost:3000/students/my-assignments/${classId}`);
                    setAssignments(assignRes.data || []);
                }
            } catch (err) {
                console.error("Data loading error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (mobile) fetchAllData();
    }, [mobile]);

    if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

    return (
        <div className="report-view-container">
            <header className="report-header">
                <div className="title-section">
                    <h1>Student Portal</h1>
                    <p>Welcome back, <strong>{studentInfo.username}</strong> | Class: {studentInfo.class_id}</p>
                </div>
            </header>

            <div className="dashboard-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                
                {/* --- Left Side: Assignments --- */}
                <section>
                    <h2 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>📝 New Assignments</h2>
                    {assignments.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {assignments.map(task => (
                                <div key={task.id} className="report-card" style={{ padding: '1.2rem' }}>
                                    <div className="card-header">
                                        <span className="subject-name" style={{ fontSize: '1rem' }}>{task.title}</span>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{task.description}</p>
                                    <div className="card-footer" style={{ marginTop: '1rem' }}>
                                        <span className="grade-text pass">📅 Due: {task.due_date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <p>No pending assignments.</p>}
                </section>

                {/* --- Right Side: Recent Reports --- */}
                <section>
                    <h2 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>📊 Academic Performance</h2>
                    {reports.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {reports.slice(0, 5).map((item, index) => {
                                const score = item.score || 0;
                                const percentage = ((score / (item.total_questions || 100)) * 100).toFixed(0);
                                return (
                                    <div key={index} className="report-card" style={{ padding: '1.2rem' }}>
                                        <div className="card-header" style={{ marginBottom: '0.5rem' }}>
                                            <span className="subject-name" style={{ fontSize: '1rem' }}>{item.subject}</span>
                                            <span className="date-tag">{new Date(item.completed_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="score-display" style={{ marginBottom: '0.5rem' }}>
                                            <span className="main-score" style={{ fontSize: '1.5rem' }}>{score}</span>
                                            <span className="out-of">/ 100</span>
                                        </div>
                                        <div className="progress-bar" style={{ height: '6px' }}>
                                            <div className="progress-fill" style={{ width: `${percentage}%`, background: percentage >= 40 ? '#10b981' : '#ef4444' }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : <p>No reports available yet.</p>}
                </section>

            </div>
        </div>
    );
};

export default viewAssignment;