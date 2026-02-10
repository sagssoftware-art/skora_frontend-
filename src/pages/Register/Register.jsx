import React from 'react';
import { useParams } from 'react-router-dom';
import StudentsForm from './components/StudentsForm';
import TeacherForm from './components/TeacherForm';
import PrincipalForm from './components/PrincipalForm';
import { useNavigate } from 'react-router-dom';
import NotFound from '../Errors/404';

const Register = () => {
  const navigate = useNavigate();
    const { type } = useParams()
  return (
    <>
    <div id="register-section-main-container">
        <div id="register-section-form-container">
            {type==='student'? <StudentsForm/>: ""}
            {type==='teacher'? <TeacherForm/>: ""}
            {type==='principal'? <PrincipalForm/>: ""}
        </div>
    </div>
    </>
  )
}

export default Register;