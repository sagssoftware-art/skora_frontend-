import React from 'react';
import './StudyBox.css';

const StudyBox = () => {
    const resources = [
        { 
            subject: "Combined Maths", 
            grade: "12-13", 
            link: "http://www.edupub.gov.lk/Administrator/English/Resource%20Books/Combined%20Mathematics%20I%20-%20Resource%20Book.pdf", 
            type: "Resource Book" 
        },
        { 
            subject: "Physics", 
            grade: "12-13", 
            link: "http://www.edupub.gov.lk/Administrator/English/Resource%20Books/Physics%20Resource%20Book%20Unit%201%20&%202.pdf", 
            type: "Resource Book (Unit 1 & 2)" 
        },
        { 
            subject: "ICT", 
            grade: "12", 
            link: "http://www.edupub.gov.lk/Administrator/Sinhala/Text%20Books/Grade%2012/ICT-G12%20S1.pdf", 
            type: "Part I Text Book" 
        },
        { 
            subject: "ICT", 
            grade: "13", 
            link: "http://www.edupub.gov.lk/Administrator/Sinhala/Text%20Books/Grade%2013/ICT%20Grade%2013%20S.pdf", 
            type: "Part II Text Book" 
        },
        { 
            subject: "Chemistry", 
            grade: "12-13", 
            link: "http://www.edupub.gov.lk/Administrator/English/Resource%20Books/Chemistry%20Unit%201%202%20&%203.pdf", 
            type: "Resource Book" 
        },
        { 
            subject: "Biology", 
            grade: "12-13", 
            link: "http://www.edupub.gov.lk/Administrator/English/Resource%20Books/Bio%20Resource%20Book%20Unit%201%20&%202.pdf", 
            type: "Resource Book" 
        },
        { 
            subject: "Syllabus List", 
            grade: "A/L", 
            link: "http://nie.lk/selesyl", 
            type: "All NIE Syllabuses" 
        }
    ];

    return (
        <div className="studybox-container">
            <header className="studybox-header">
                <h2>📚 Official Resource Library</h2>
                <p className="subtitle">Download official text books and resource materials from e-thaksalawa & EduPub</p>
            </header>

            <div className="resource-grid">
                {resources.map((res, index) => (
                    <div key={index} className="resource-card">
                        <span className="grade-badge">Grade {res.grade}</span>
                        <h4>{res.subject}</h4>
                        <p>{res.type}</p>
                        <a 
                            href={res.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="download-btn"
                        >
                            View PDF 📥
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudyBox;