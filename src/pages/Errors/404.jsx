import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      padding: '0 10%',
    },
    contentWrapper: {
      display: 'flex',
      alignItems: 'center',
      maxWidth: '1000px',
      gap: '40px'
    },
    image: {
      width: '400px', // Adjust based on your actual file size
      height: 'auto',
    },
    textContainer: {
      textAlign: 'left',
    },
    header: {
      fontSize: '48px',
      fontWeight: '800',
      color: '#000000',
      margin: '0 0 20px 0',
      lineHeight: '1.1',
    },
    paragraph: {
      fontSize: '18px',
      color: '#333',
      margin: '0',
    },
    link: {
      color: '#333',
      textDecoration: 'underline',
      cursor: 'pointer',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        {/* Replace the src with your actual image path */}
        <img 
          src="/404.png" 
          alt="Anxiety Character" 
          style={styles.image} 
        />
        
        <div style={styles.textContainer}>
          <h1 style={styles.header}>
            We can’t find what<br />you’re looking for.
          </h1>
          <p style={styles.paragraph}>
            Let’s go <Link to="/" style={styles.link}>back to Headquarters</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;