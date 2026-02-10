import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './ReportView.css';

const ReportView = () => {
    const [reports, setReports] = useState([]);
    const [studentInfo, setStudentInfo] = useState({ username: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // localStorage එකෙන් ළමයාගේ මොබයිල් නම්බර් එක ගන්නවා
    const studentMobile = localStorage.getItem('SKORASTUsession');

    const fetchReports = useCallback(async (mobile) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://skora-backend-v2.vercel.app/students/my-full-reports/${mobile}`);
            
            // Backend එකෙන් එවන දත්ත පරීක්ෂා කිරීමට (Console එක බලන්න)
            console.log("Full Response:", response.data);

            setReports(response.data.reports || []);
            setStudentInfo({ username: response.data.username || 'Student' });
            setError(null);
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Could not load academic reports.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (studentMobile) {
            fetchReports(studentMobile);
        } else {
            setLoading(false);
            setError("Session expired. Please login again.");
        }
    }, [studentMobile, fetchReports]);

    if (loading) return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>⌛ Loading your performance data...</p>
        </div>
    );

    if (error) return <div className="error-message">⚠️ {error}</div>;

    return (
        <div className="report-view-container">
            {/* Header Section */}
            <header className="report-header">
                <div className="title-section">
                    <h1>Academic Progress</h1>
                    <p>Student Profile: <strong>{studentInfo.username}</strong></p>
                </div>
                <div className="overall-badge">
                    Total Assessments: {reports.length}
                </div>
            </header>

            {reports.length > 0 ? (
                <div className="report-grid">
                    {reports.map((item, index) => {
                        // ලකුණු හඳුනාගැනීම - Backend එකේ score හෝ marks ලෙස තිබිය හැක
                        const currentScore = item.score !== undefined ? item.score : (item.marks !== undefined ? item.marks : 0);
                        const totalPossible = item.total_questions || 100;
                        const percentage = ((Number(currentScore) / Number(totalPossible)) * 100).toFixed(0);
                        
                        const isPassed = percentage >= 40;

                        return (
                            <div key={index} className="report-card">
                                <div className="card-header">
                                    <span className="subject-name">{item.subject || 'General'}</span>
                                    <span className="date-tag">
                                        {item.completed_at ? new Date(item.completed_at).toLocaleDateString() : 'Recent'}
                                    </span>
                                </div>
                                
                                <div className="score-display">
                                    <div className="main-score">{currentScore}</div>
                                    <div className="out-of">out of {totalPossible}</div>
                                </div>

                                <div className="progress-container">
                                    <div className="progress-label">
                                        <span>Performance Level</span>
                                        <span>{percentage}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill" 
                                            style={{ 
                                                width: `${percentage}%`,
                                                background: percentage >= 75 ? '#2ecc71' : percentage >= 40 ? '#f1c40f' : '#e74c3c'
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <span className={`grade-text ${isPassed ? 'pass' : 'fail'}`}>
                                        {isPassed ? '✅ SUCCESS' : '❌ NEEDS IMPROVEMENT'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">📊</div>
                    <h3>No reports found yet.</h3>
                    <p>Once your teachers upload marks for {studentInfo.username}, they will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default ReportView;