import React from 'react'
import Navbar from './StudentComponent/Navbar';
import Hero from './StudentComponent/Hero';
import KeyFeatures from './HeroComponent/KeyFeatures';

const Student = () => {
  return (
    <>
    <div id="student-dashboard-main-container">
      <Navbar/>
      <Hero/>
      <KeyFeatures/>
    </div>
    </>
  )
}

export default Student;