import React from 'react';
import styled from 'styled-components';

const Button = () => {
  return (
    <StyledWrapper>
      <button>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
</svg>
    </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 10px;
   font-family: inherit;
   font-size: 13px;
   font-weight: 500;
   text-transform: uppercase;
   letter-spacing: 0.4px;
   color: #7e97b8;
   background-color: #e0e8ef;
   border-style: solid;
   border-width: 2px 2px 2px 2px;
   border-color: rgba(255, 255, 255, 0.333);
   border-radius: 40px 40px 40px 40px;
   padding: 10px;
   width: 150px;
   transform: translate(0px, 0px) rotate(0deg);
   transition: 0.2s;
   box-shadow: -4px -2px 16px 0px #ffffff, 4px 2px 16px 0px rgb(95 157 231 / 48%);
  }

  button:hover {
   color: #516d91;
   background-color: #E5EDF5;
   box-shadow: -2px -1px 8px 0px #ffffff, 2px 1px 8px 0px rgb(95 157 231 / 48%);
  }

  button:active {
   box-shadow: none;
  }`;

export default Button;
