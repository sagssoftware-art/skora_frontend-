import React from 'react'
import  Nav  from './componets/Nav';
import Hero from './componets/Hero';
import Banner from './componets/Banner';
import Footer from './componets/Footer';
import TransformSection from './componets/TransformSection';

const Home = () => {
  if(localStorage.getItem('SKORASTUsession')) {
    window.location.href = '/verify/student'; 
  }else if(localStorage.getItem('SKORATEAsession')) {
    window.location.href = '/verify/teacher'; 
  }else if(localStorage.getItem('SKORAPRINsession')) {
    window.location.href = '/verify/principal'; 
  }
  return (
    <>
    <Nav/>
    <Hero/>
    <Banner/>
    <TransformSection/>
    <Footer/>
    </>
  )
}

export default Home;