import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UpdateReports.css'; // අපි කලින් පාවිච්චි කරපු Form CSS එකම ගන්න පුළුවන්

const AddAssignment = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        due_date: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('http://skora-backend-v2.vercel.app/teachers/add-assignment', {
                class_id: classId,
                ...formData
            });
            alert("✅ Assignment posted successfully!");
            navigate(-1); // ආපහු කලින් පේජ් එකට යනවා
        } catch (err) {
            console.error(err);
            alert("❌ Failed to post assignment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reports-container">
            <div className="reports-header">
                <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
                <h2>📝 Post New Assignment</h2>
                <p>Target Class: <strong>#{classId}</strong></p>
            </div>

            <div className="score-entry-area" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="entry-card">
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Assignment Title</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Unit 5 - Structure of Atom"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Instructions / Description</label>
                            <textarea 
                                placeholder="Write assignment details here..."
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px' }}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Due Date</label>
                            <input 
                                type="date" 
                                value={formData.due_date}
                                onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                                required
                            />
                        </div>

                        <div className="btn-row">
                            <button type="submit" className="submit-score-btn" disabled={loading}>
                                {loading ? "Publishing..." : "Post to Students"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddAssignment;