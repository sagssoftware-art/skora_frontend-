import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UpdateReports.css';

const UpdateReports = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [myClasses, setMyClasses] = useState([]); // ගුරුවරයාගේ පන්ති ලිස්ට් එක
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [reportData, setReportData] = useState({ subject: '', score: '' });
    const [loading, setLoading] = useState(false);

    // Session එකෙන් ටීචර්ගේ Number එක ගන්නවා
    const getSession = () => {
        const session = localStorage.getItem('SKORATEAsession');
        if (!session) return null;
        try { return JSON.parse(session); } catch (e) { return session; }
    };

    const sessionData = getSession();
    const teacherNumber = sessionData?.number || sessionData;

    useEffect(() => {
        if (teacherNumber) {
            fetchMyClasses();
        }
    }, [teacherNumber]);

    useEffect(() => {
        if (classId && classId !== "undefined") {
            fetchClassStudents();
            setSelectedStudent(null); // පන්තිය මාරු කරද්දී කලින් සිලෙක්ට් කරපු ලමයව අයින් කරනවා
        }
    }, [classId]);

    const fetchMyClasses = async () => {
        try {
            const res = await axios.get(`http://skora-backend-v2.vercel.app/teachers/my-classes/${teacherNumber}`);
            setMyClasses(res.data);
        } catch (err) {
            console.error("Error loading classes:", err);
        }
    };

    const fetchClassStudents = async () => {
        try {
            const res = await axios.get(`http://skora-backend-v2.vercel.app/teachers/class-students/${classId}`);
            setStudents(res.data);
        } catch (err) {
            console.error("Error fetching students:", err);
        }
    };

    const handleUpdateScore = async (e) => {
        e.preventDefault();
        if (!selectedStudent) return alert("Please select a student first!");
        
        setLoading(true);
        try {
            await axios.post('http://skora-backend-v2.vercel.app/teachers/update-student-report', {
                student_id: selectedStudent.student_id,
                class_id: classId,
                subject: reportData.subject,
                score: reportData.score,
                total_questions: 100 
            });

            alert(`✅ Record Saved for ${selectedStudent.student_id}!`);
            setReportData({ subject: '', score: '' });
            setSelectedStudent(null);
        } catch (err) {
            alert("Error saving record.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reports-container">
            <div className="reports-header-card">
                <div className="header-top">
                    <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
                    <h2>📊 Student Performance Manager</h2>
                    
                    {/* 🆕 පන්ති තෝරන Dropdown එක */}
                    <select 
                        className="class-picker"
                        value={classId || ""} 
                        onChange={(e) => navigate(`/updateReports/${e.target.value}`)}
                    >
                        <option value="">Choose Class</option>
                        {myClasses.map(c => (
                            <option key={c.class_id} value={c.class_id}>{c.class_name}</option>
                        ))}
                    </select>
                </div>
                <p className="header-sub">Selected Class: <strong>{classId ? `#${classId}` : "None"}</strong></p>
            </div>

            <div className="reports-layout">
                {/* වම් පැත්තේ ලිස්ට් එක */}
                <div className="student-side-list">
                    <h3>Class Roster ({students.length})</h3>
                    <div className="list-container">
                        {students.length > 0 ? students.map(stu => (
                            <div 
                                key={stu.student_id} 
                                className={`student-item ${selectedStudent?.student_id === stu.student_id ? 'active' : ''}`}
                                onClick={() => setSelectedStudent(stu)}
                            >
                                <div className="avatar">{stu.student_id.charAt(0).toUpperCase()}</div>
                                <div className="info">
                                    <span className="id">{stu.student_id}</span>
                                    <small>Student</small>
                                </div>
                            </div>
                        )) : <p className="empty-msg">No students found.</p>}
                    </div>
                </div>

                {/* දකුණු පැත්තේ Form එක */}
                <div className="score-entry-area">
                    {selectedStudent ? (
                        <div className="premium-form-card">
                            <div className="form-header">
                                <h3>Updating Marks for: <span className="hl">{selectedStudent.student_id}</span></h3>
                            </div>
                            
                            <form onSubmit={handleUpdateScore}>
                                <div className="field-group">
                                    <label>Subject</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Mathematics" 
                                        value={reportData.subject}
                                        onChange={(e) => setReportData({...reportData, subject: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="field-group">
                                    <label>Score (0-100)</label>
                                    <input 
                                        type="number" 
                                        max="100" min="0"
                                        placeholder="00" 
                                        value={reportData.score}
                                        onChange={(e) => setReportData({...reportData, score: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="actions">
                                    <button type="submit" className="save-btn" disabled={loading}>
                                        {loading ? "Saving..." : "Save Record"}
                                    </button>
                                    <button type="button" className="clear-btn" onClick={() => setSelectedStudent(null)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="placeholder-card">
                            <div className="pulse-icon">👤</div>
                            <h3>Select a Student</h3>
                            <p>Pick a student from the list to update their marks.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdateReports;