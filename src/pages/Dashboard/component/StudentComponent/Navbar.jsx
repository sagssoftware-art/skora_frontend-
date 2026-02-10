import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './NavBar.css';
import Button from './NAVcomponent/Button';

const Navbar = () => {
    const [userINFO, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    // Helper function to calculate current grade
    const getJustNowGrade = (regDate, regGrade) => {
        if (!regDate || !regGrade) return "N/A";
        
        const currentYear = new Date().getFullYear();
        const registeredYear = new Date(regDate).getFullYear();
        
        // Difference in years (e.g., 2026 - 2026 = 0)
        const yearsPassed = currentYear - registeredYear;
        const currentGrade = parseInt(regGrade) + yearsPassed;
        
        return `Grade ${currentGrade}`;
    };

    function logout() {
        localStorage.removeItem('SKORASTUsession');
        window.location.href = '/';
    }

    useEffect(() => {
        const number = localStorage.getItem('SKORASTUsession');
        if (number) {
            axios.post('http://localhost:3000/studentDash/userinfo', { number })
                .then((response) => {
                    // Assuming your backend returns an array [ {userData} ]
                    setUser(response.data[0]); 
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching user info:", error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <>
            <div id="student-dashboard-navbar">
                <div id="student-nav-bar-logo-container">
                    <img src="/logo.png" alt="Logo" />
                    <span id="student-dashboard-navbarx">Skora</span>
                </div>

                <div id="student-nav-bar-action-btns">
                    <div id="student-nav-bar-action-btns-section1">
                        <div id="student-nav-bar-text-info-pane">
                            <span id="div-nav-bar-user-name">
                                {loading ? "Loading..." : (userINFO.username || "Guest")}
                            </span>
                            <span id="student-nav-bar-grade">
                                {loading 
                                    ? "..." 
                                    : getJustNowGrade(userINFO.register_date, userINFO.current_grade)
                                }
                            </span> 
                        </div>
                        <div id="student-nav-bar-profile-icon">
                            <span id="profile-name-icon">
                                {userINFO.username ? userINFO.username.charAt(0).toUpperCase() : 'P'}
                            </span>
                        </div>
                    </div>

                    <div id="student-nav-bar-action-btns-section2">
                        <div onClick={logout}>
                            <Button id="studen-nav-bar-logout-btn">Logout</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;