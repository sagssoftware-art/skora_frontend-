import React from 'react'
import './Nav.css'
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <>
    <div id="navigation-bar-main-container">
        <div className="navigation-bar-content-container">
            <div id="navigation-bar-logo-container">
                <img src="/logo.png" alt="" />
                <p id="navigation-bar-logo-text">
                    <span id="navigation-bar-logo-text-service-name">Skora</span>
                    <span id="navigation-bar-logo-text-service-catgory">for Education</span>
                </p>
            </div>
            <div id="navigation-bar-action-buttons-container">
                <ul id="navigation-bar-actions-list">
                    <li className="navigation-bar-action-dropdown-content-carrier">
                        Login
                        <div className="navigation-bar-dropdown-menu"><ul>
                            <li className="navigation-bar-dropdown-item"><Link to="/login/student">To Student Account</Link></li>
                            <li className="navigation-bar-dropdown-item"><Link to="/login/teacher">To Teacher Account</Link></li>
                            <li className="navigation-bar-dropdown-item"><Link to="/login/principal">To Principal Account</Link></li>
                        </ul></div>
                    </li>
                    <li className="navigation-bar-action-dropdown-content-carrier">
                        Register
                        <div className="navigation-bar-dropdown-menu"><ul>
                            <li className="navigation-bar-dropdown-item"><Link to="/register/student">As Student</Link></li>
                            <li className="navigation-bar-dropdown-item"><Link to="/register/teacher">As Teacher</Link></li>
                            <li className="navigation-bar-dropdown-item"><Link to="/register/principal">As Principal</Link></li>
                        </ul></div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    </>
  )
}

export default Nav;