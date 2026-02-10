import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useState } from 'react';
import './SnapQuiz.css';

// API Key එක (පසුව මෙය .env ෆයිල් එකකට දාන්න)
const genAI = new GoogleGenerativeAI("AIzaSyA4Rz0YxPcEZ_8Or-58xYh_nwS2_I14kfs");

const Interface = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const generateQuiz = async (subjectName) => {
        setLoading(true);
        setQuestions([]);
        setSelectedAnswers({});
        setScore(0);
        setShowResults(false);

        try {
            // v1 apiVersion එක force කිරීම මගින් 404 දෝෂය මගහරවා ගනී
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1' });

            const prompt = `Generate 5 MCQ questions for Sri Lankan A/L ${subjectName} in JSON format. 
                           The output must be ONLY a valid JSON array. 
                           Structure: [{"question": "text", "options": ["option1", "option2", "option3", "option4"], "correctAnswer": "exact_text_from_options"}]`;
            
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            // Markdown tag අයින් කිරීම
            const cleanJson = text.replace(/```json|```/g, "").trim();
            setQuestions(JSON.parse(cleanJson));

        } catch (error) {
            console.error("AI Fetch Error:", error);
            alert("AI Error! Please check your internet or API limits.");
        }
        setLoading(false);
    };

    const handleAnswerClick = (qIndex, option, correctAns) => {
        if (selectedAnswers[qIndex]) return;

        setSelectedAnswers({ ...selectedAnswers, [qIndex]: option });
        
        if (option === correctAns) {
            setScore(prev => prev + 1);
        }

        // ප්‍රශ්න 5 ම ඉවර දැයි පරීක්ෂා කිරීම
        if (Object.keys(selectedAnswers).length + 1 === 5) {
            setShowResults(true);
        }
    };

    return (
        <div className="snapquiz-container">
            <header className="quiz-header">
                <h2 className="premium-title">⚡ Snap Quiz AI</h2>
                <p>Real-time AI Assessment System</p>
                <div className="button-group">
                    <button className="gen-btn" disabled={loading} onClick={() => generateQuiz("ICT")}>ICT Exam</button>
                    <button className="gen-btn" disabled={loading} onClick={() => generateQuiz("Physics")}>Physics Exam</button>
                </div>
            </header>

            {loading && (
                <div className="loader-container">
                    <div className="spinner"></div>
                    <p>Skora AI is crafting your paper...</p>
                </div>
            )}

            {showResults && (
                <div className="result-card">
                    <h3>Exam Completed! 🎉</h3>
                    <p className="final-score">Your Score: {score} / 5</p>
                    <p className="percentage">({(score / 5) * 100}%)</p>
                    <button className="retry-btn" onClick={() => setQuestions([])}>Finish</button>
                </div>
            )}

            <div className="quiz-display">
                {questions.map((q, i) => (
                    <div key={i} className="q-card-premium">
                        <div className="q-number">Question {i + 1}</div>
                        <p className="q-text">{q.question}</p>
                        <div className="opt-grid">
                            {q.options.map((opt, idx) => {
                                const isSelected = selectedAnswers[i] === opt;
                                const isCorrect = opt === q.correctAnswer;
                                
                                let btnClass = "opt-btn";
                                if (selectedAnswers[i]) {
                                    if (isCorrect) btnClass += " correct-opt";
                                    else if (isSelected) btnClass += " wrong-opt";
                                    else btnClass += " disabled-opt";
                                }

                                return (
                                    <button 
                                        key={idx} 
                                        className={btnClass}
                                        onClick={() => handleAnswerClick(i, opt, q.correctAnswer)}
                                        disabled={selectedAnswers[i]}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                        {selectedAnswers[i] && (
                            <p className={`feedback ${selectedAnswers[i] === q.correctAnswer ? 'correct' : 'wrong'}`}>
                                {selectedAnswers[i] === q.correctAnswer ? "✔ Correct Answer!" : `✖ Incorrect. Correct: ${q.correctAnswer}`}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Interface;