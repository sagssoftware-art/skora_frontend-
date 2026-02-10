import React from 'react'
import { useParams } from 'react-router-dom'
import SecureCard from './SecureCard'

const Verifier = () => {
  const {type} = useParams();
  return (
    <>
    {type==='student'?<SecureCard title="Student" url="/students/login" query="SKORASTUsession"/>:""}
    {type==='teacher'?<SecureCard title="Teacher" url="/teachers/login" query="SKORATEAsession"/>:""}
    {type==='principal'?<SecureCard title="Principal" url="/principal/login" query="SKORAPRINsession"/>:""}
    </>
  )
}

export default Verifier;