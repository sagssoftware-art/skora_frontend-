import React from 'react'
import Button from '../StudentComponent/NAVcomponent/Button'
import './PrincipalNav.css'
import {useNavigate} from 'react-router-dom'

const PrincipalNav = () => {
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem('SKORAPRINsession');
    navigate('/');
  }
  return (
    <>
    <div id="principal-nav-bar-main-container">
        <div id="principal-nav-bar-logo-container">
            <img src="/logo.png" alt="" />
            <span id="logo-container-text-pane">Skora</span>
        </div>
        <div id="principal-dashborad-action-btn-container">
            <div id="logout" onClick={logout}>
              <Button/>
            </div>
             
        </div>
    </div>
    </>
  )
}

export default PrincipalNav