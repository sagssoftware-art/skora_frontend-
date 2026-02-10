import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Button = (props) => {
  const navigate = useNavigate();
  function openPage() {
    navigate(props.link)
  }
  return (
    <StyledWrapper onClick={openPage}>
      <div className="uiverse">
        <span className="tooltip">{props.abbrivation}</span>
        <span>
          {props.title}
        </span>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .uiverse {
    position: relative;
    /* Soft mint/white background */
    background: #f0fdf4; 
    /* Deep forest green for text contrast */
    color: #166534; 
    padding: 15px;
    margin: 10px;
    border-radius: 10px;
    width: 150px;
    height: 50px;
    font-size: 17px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    /* Soft green-tinted shadow */
    box-shadow: 0 10px 15px rgba(22, 101, 52, 0.1); 
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    border: 1px solid #dcfce7;
}

.tooltip {
    position: absolute;
    top: 0;
    font-size: 14px;
    background: #ffffff;
    color: #ffffff;
    padding: 5px 8px;
    border-radius: 5px;
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.tooltip::before {
    position: absolute;
    content: "";
    height: 8px;
    width: 8px;
    background: #ffffff;
    bottom: -3px;
    left: 50%;
    transform: translate(-50%) rotate(45deg);
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.uiverse:hover .tooltip {
    top: -140%;
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
}

/* Updated Hover State: Nature Green Gradient */
.uiverse:hover,
.uiverse:hover .tooltip,
.uiverse:hover .tooltip::before {
    background: linear-gradient(320deg, #22c55e, #15803d);
    color: #ffffff;
    border-color: transparent;
}

svg:hover span,
svg:hover .tooltip {
    text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.1);
}`;

export default Button;
