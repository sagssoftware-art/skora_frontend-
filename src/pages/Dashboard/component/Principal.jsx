import React from 'react'
import PrincipalNav from './PrincipalComponent/PrincipalNav'
import PrincipalHero from './PrincipalComponent/PrincipalHero'

const Principal = () => {
  return (
    <>
    <div id="principal-dashboard-container">
        <PrincipalNav/>
        <PrincipalHero/>
    </div>
    </>
  )
}

export default Principal