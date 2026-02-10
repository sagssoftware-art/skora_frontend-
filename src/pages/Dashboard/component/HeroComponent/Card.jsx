import React from 'react';
import styled from 'styled-components';
import Button from '/public/Button';
import { useNavigate } from "react-router-dom";

const Card = (props) => {
  const navigate = useNavigate();
  function navigateFunc() {
    if(localStorage.getItem('SKORASTUsession')) {
      navigate(props.link)
    }

  }
  return (
    <StyledWrapper>
      <div className="card">
        <div className="content">
          <div className="back" >
            <div className="back-content">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
</svg>
              <strong>{props.title}</strong>
            </div>
          </div>
          <div className="front"  onClick={navigateFunc}>
            <div className="img">
              <div className="circle">
              </div>
              <div className="circle" id="right">
              </div>
              <div className="circle" id="bottom">
              </div>
            </div>
            <div className="front-content">
              <small className="badge">{props.title}</small>
              <div className="description">
                <div className="title">
                  <p className="title">
                    <strong>{props.cardTitle}</strong>
                  </p>
                  {/* <svg fillRule="nonzero" height="15px" width="15px" viewBox="0,0,256,256" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><g style={{mixBlendMode: 'normal'}} textAnchor="none" fontSize="none" fontWeight="none" fontFamily="none" strokeDashoffset={0} strokeDasharray strokeMiterlimit={10} strokeLinejoin="miter" strokeLinecap="butt" strokeWidth={1} stroke="none" fillRule="nonzero" fill="#20c997"><g transform="scale(8,8)"><path d="M25,27l-9,-6.75l-9,6.75v-23h18z" /></g></g></svg> */}
                </div>
                <p className="card-footer">
                    <Button/>

                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    overflow: visible;
    width: 210px;
    height: 280px;
    font-family: 'Inter', sans-serif;
  }

  .content {
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 600ms cubic-bezier(0.23, 1, 0.32, 1);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
    border-radius: 15px;
  }

  /* Side shared styles */
  .front, .back {
    background-color: #ffffff;
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: 15px;
    overflow: hidden;
    border: 1px solid #d1d5db;
  }

  /* BACK SIDE (Initial visible state) */
  .back {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Animated border effect using your Green palette */
  .back::before {
    position: absolute;
    content: ' ';
    display: block;
    width: 100px;
    height: 160%;
    background: linear-gradient(90deg, 
      transparent, 
      #065f46, 
      #10b981, 
      #34d399, 
      #10b981, 
      transparent);
    animation: rotation_481 4000ms infinite linear;
  }

  .back-content {
    position: absolute;
    width: 96%;
    height: 96%;
    background-color: #ffffff;
    border-radius: 12px;
    color: #065f46;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;
  }

  .back-content svg {
    color: #10b981;
    filter: drop-shadow(0 0 5px rgba(16, 185, 129, 0.35));
  }

  /* HOVER LOGIC */
  .card:hover .content {
    transform: rotateY(180deg);
  }

  @keyframes rotation_481 {
    0% { transform: rotateZ(0deg); }
    100% { transform: rotateZ(360deg); }
  }

  /* FRONT SIDE (Visible on hover) */
  .front {
    transform: rotateY(180deg);
    background-color: #f9fafb;
  }

  .front .front-content {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 2;
  }

  .badge {
    background-color: rgba(5, 150, 105, 0.1);
    color: #059669;
    padding: 4px 12px;
    border-radius: 20px;
    border: 1px solid rgba(5, 150, 105, 0.2);
    width: fit-content;
    font-size: 10px;
    font-weight: 700;
  }

  .description {
    width: 100%;
    padding: 12px;
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    border-radius: 10px;
    border: 1px solid #d1d5db;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #1a1a1a;
  }

  .title strong {
    font-size: 12px;
    line-height: 1.2;
  }

  .card-footer {
    color: #666;
    margin-top: 8px;
    font-size: 9px;
    font-weight: 500;
  }

  /* Background Glow Circles */
  .front .img {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #ffffff;
  }

  .circle {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background-color: #34d399;
    position: absolute;
    filter: blur(30px);
    opacity: 0.4;
    animation: floating 3000ms infinite ease-in-out;
  }

  #bottom {
    background-color: #059669;
    left: -20px;
    bottom: -20px;
    width: 120px;
    height: 120px;
    animation-delay: -800ms;
  }

  #right {
    background-color: #10b981;
    right: -10px;
    top: -10px;
    width: 80px;
    height: 80px;
    animation-delay: -1800ms;
  }

  @keyframes floating {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(10px, 15px); }
  }

  .enter-btn {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid rgba(16, 185, 129, 0.35);
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: all 0.25s ease;

  box-shadow:
    0 4px 10px rgba(16, 185, 129, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

/* icon */
.enter-btn svg {
  transition: transform 0.25s ease;
}

/* hover */
.enter-btn:hover {
  transform: translateY(-2px);
  box-shadow:
    0 8px 18px rgba(16, 185, 129, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

/* arrow move */
.enter-btn:hover svg {
  transform: translateX(3px);
}

/* click */
.enter-btn:active {
  transform: translateY(0);
  box-shadow:
    0 3px 8px rgba(16, 185, 129, 0.25),
    inset 0 2px 4px rgba(0, 0, 0, 0.15);
}

`;

export default Card;