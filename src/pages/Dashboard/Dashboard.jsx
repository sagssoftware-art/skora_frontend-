import React from 'react'
import { useParams } from 'react-router-dom';
import Student from './component/Student';
import Teacher from './component/Teacher';
import Footer from './Footer';
import Loader1 from '../../../public/Loader1';
import Principal from './component/Principal';

const Dashboard = () => {
    const {type} = useParams();
  return (
    <>
    {type=='student'?<Student/>:""}
    {type=='teacher'?<Teacher/>:""}
    {type=='principal'?<Principal/>:""}
    <Footer/>
    </>
  )
}

export default Dashboard;