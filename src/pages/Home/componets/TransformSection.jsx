import React, { useState, useEffect } from 'react';
import './TransformSection.css';

const TransformSection = () => {
  const places = ["Institute", "School", "Education Center", "Academy", "Team"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % places.length);
    }, 1600); // Change word every 1.6 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="transform-container">
      <div className="transform-card">
        <h2 className="transform-heading">
          Ready to transform your <br />
          <span key={places[index]} className="changing-text">
            {places[index]}?
          </span>
        </h2>
        <button className="google-cta-button">
          Get SkoPro Server
        </button>
      </div>
    </section>
  );
};

export default TransformSection;