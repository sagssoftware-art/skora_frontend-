import React from 'react'
import './Hero.css'

const Hero = () => {
  return (
    <>
    <div id="hero-section-main-container">
        <div id="hero-section-title-pane">
            <div id="hero-section-logo-pane">
                <div id="hero-section-logo-image">
                    <img src="/logo.png" alt="" />
                </div>
                <div id="hero-section-logo-text">
                    <span id="hero-section-logo-text-service-name">Skora</span>
                    <span id="hero-section-logo-text-service-provider">by Proto-Xue</span>
                </div>
            </div>
            <div id="hero-section-text-pane">
                <div id="hero-section-main-heading">
                Where Learning, Teaching and Management meets together
                </div>
                <div id="hero-section-sub-title">
                    Skora is the platform for everyone from everywhere at anytime. New educational platform that 97% compatible for Sri-Lankans with the enchanced AI and Super perfoming alogorithmes.
                </div>
            </div>
        </div>
        <div id="hero-section-right-side-image">
            <video 
  src="/hero-section-right-side.mp4" 
  autoPlay 
  muted 
  loop 
  playsInline
  aria-label="Skora platform demonstration"
/>
        </div>
    </div>
    </>
  )
}

export default Hero;