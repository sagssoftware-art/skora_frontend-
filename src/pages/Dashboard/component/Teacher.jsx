import React from 'react'
import TeacherNav from './TeacherComponent/TeacherNav';
import TeacherHero from './TeacherComponent/TeacherHero';

const Teacher = () => {
  return (
    <>
    <div id="educator-dashboard">
        <TeacherNav/>
        <TeacherHero/>
    </div>
    </>
  )
}

export default Teacher;