import React from 'react'
import { useParams } from 'react-router-dom'
import StudentForm from './components/StudentForm';
import TeacherForm from './components/TeacherForm';
import PrincipalForm from './components/PrincipalFrom';
import NotFound from '../Errors/404'
const Login = () => {
    const { type } = useParams();
    return (
        <div>
            <div id="login-section">
                <div id="login-section-student-login-section">
                    {type==='student'? <StudentForm/>: ""}
                    {type==='teacher'? <TeacherForm/>: ""}
                    {type==='principal'? <PrincipalForm/>: ""}
                </div>
            </div>
        </div>
    )
}

export default Login;