import React from 'react'
import './Banner.css'

const Banner = () => {
  return (
    <>
    <div id="banner-section-main-container">
        <div id="banner-section-left-side">
            <div id="banner-left-side-text-pane">
                <p id="banner-section-heading">
                    Bring all of your Data together for Skora Worspace
                </p>
                <p id="banner-section-sub-heading">
                    Skora will keep tracked all your academic reports and docs.
                </p>
            </div>
        </div>
        <div id="banner-section-right-side">
            <img src="/services.png" alt="services" />
        </div>
    </div>
    </>
  )
}

export default Banner;