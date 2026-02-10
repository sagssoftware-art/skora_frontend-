import React from 'react'
import './TeacherNav.css'
import { useNavigate } from 'react-router-dom';

const TeacherNav = () => {
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem('SKORATEAsession');
    navigate('/')
  }
  return (
    <>
    <div id="educator-nav-bar">
        <div id="educator-nav-bar-logo-container">
            <img src="/logo.png" alt="" />
            <span id="logo-text-pane">Skora</span>
        </div>
        <div id="educator-actions-container">
            <button id="logout-btn-educator" onClick={logout}>Logout</button>
        </div>
    </div>
    </>
  )
}

export default TeacherNav