import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const Card = (props) => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="image" />
        <div className="card-info">
          <span>{props.name}</span>
          <p>Skora Educator</p>
        </div>
        <Button title="Update Profile" abbrivation="This Feature Availble soon"/>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    width: 350px;
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 10px;
    background-color: #f0fdf4; /* Very light mint background */
    border-radius: 15px;
    position: relative;
    overflow: hidden;
    border: 1px solid #dcfce7;
  }

  .card::before {
    content: "";
    width: 350px;
    height: 100px;
    position: absolute;
    top: 0;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    border-bottom: 3px solid #fefefe;
    /* Refreshing Green Gradient */
    background: linear-gradient(40deg, #166534 0%, #22c55e 50%, #86efac 100%);
    transition: all 0.5s ease;
  }

  .card * {
    z-index: 1;
  }

  .image {
    width: 90px;
    height: 90px;
    /* Matching Forest Green */
    background-color: #15803d; 
    border-radius: 50%;
    border: 4px solid #fefefe;
    margin-top: 30px;
    transition: all 0.5s ease;
  }

  .card-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    transition: all 0.5s ease;
  }

  .card-info span {
    font-weight: 600;
    font-size: 24px;
    /* Deep green for readability */
    color: #064e3b; 
    margin-top: 15px;
    line-height: 5px;
  }

  .card-info p {
    color: rgba(6, 78, 59, 0.6);
  }

  .button {
    text-decoration: none;
    /* Primary Action Green */
    background-color: #16a34a;
    color: white;
    padding: 5px 20px;
    border-radius: 5px;
    border: 1px solid white;
    transition: all 0.5s ease;
  }

  .card:hover::before {
    width: 350px;
    height: 300px;
    border-bottom: none;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    transform: scale(0.95);
  }

  .card:hover .card-info {
    transform: translate(0%,-25%);
  }

  /* Text color flip on hover so it's readable against the dark green gradient */
  .card:hover .card-info span, 
  .card:hover .card-info p {
    color: #ffffff;
  }

  .card:hover .image {
    transform: scale(2) translate(-60%,-40%);
  }

  .button:hover {
    /* Pop of lime/yellow-green on hover */
    background-color: #84cc16;
    color: #064e3b;
    transform: scale(1.1);
  }`;

export default Card;
