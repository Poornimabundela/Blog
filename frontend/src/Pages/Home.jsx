import React from 'react';
import LatestPost from '../Components/LatestPost';
import './Home.css';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="hero-section text-white text-center">
        <div className="hero-overlay">
          <h1 className="animated-heading">
           Welcome
          </h1>
          <p>
          Dive into a world of creativity, insights, and inspiration. TIT Blog Page — Connecting Students, Sharing Stories, Shaping the Future!
          </p>
          <button className="cta-button mt-3">Get Started</button>
        </div>
      </div>

      {/* Latest Posts Section */}
      <div className="container-fluid p-5 bg-dark text-light">
       
        <LatestPost />
      </div>
    </>
  );
}
