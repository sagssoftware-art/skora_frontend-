import React, { useState } from 'react';
import './SecureCard.css'
import axios from 'axios';

const SecureCard = ({ title, url, query }) => {
  function login() {
    let location = 'http://localhost:3000'+url;
    let userData = {
      mobileNumber: localStorage.getItem(query),
      password: document.getElementById('password').value
    }
    let userData2 = {
      number: localStorage.getItem(query),
      password: document.getElementById('password').value
    }
    if(title == 'Principal') {
    axios.post(location, userData)
    .then((response) => {
        if (response.data.msg) {
            localStorage.setItem('SKORAPRINsession', response.data.principal.user.number);
            window.location.href = '/dashboard/principal';
        } else {
            alert("Invalid credentials. Please try again.");
        }
    })
    .catch((error) => {
        console.error("Login Error:", error);
        alert(error.response?.data?.msg || "An error occurred during login.");
    });
    }
    if(title == 'Teacher') {
        console.log(userData);
    axios.post(location, userData)
    
    .then((response) => {
        if (response.data.msg) {
            localStorage.setItem('SKORATEAsession', localStorage.getItem('SKORATEAsession'));
            window.location.href = '/dashboard/teacher';
            
        } else {
            alert("Invalid credentials. Please try again.");
        }
    })
    .catch((error) => {
        console.error("Login Error:", error);
        alert(error.response?.data?.msg || "An error occurred during login.");
    });
    }
    if(title == 'Student') {
    axios.post(location, userData2)
    .then((response) => {
      console.log(response);
      
        if (response.data.msg) {
            localStorage.setItem('SKORASTUsession', localStorage.getItem('SKORASTUsession'));
            window.location.href = '/dashboard/student';
        } else {
            alert("Invalid credentials. Please try again.");
        }
    })
    .catch((error) => {
        console.error("Login Error:", error);
        alert(error.response?.data?.msg || "An error occurred during login.");
    });
    }
    
  }
  return(
  <>
  <div id="verifier-main-container">
    <div id="verifier-title">Access Your {title} Account</div>
    <div id="input-field-container">
      <input type="password" id="password" placeholder='Enter Password'/>
      <button id="verify-button" onClick={login}>Login</button>
    </div>
    <div id="notice-area">Due to Security porpose you need to enter password all tie you're using app.</div>
  </div>
  </>
)};

export default SecureCard;