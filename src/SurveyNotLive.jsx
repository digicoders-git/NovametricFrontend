import React from "react";
import './SurveyNotLive.css'

const SurveyNotLive = () => {
  return (
    <div className="notlive-wrapper">
      <div className="notlive-content">
        {/* Logo */}
        <div className="brand">
          <img src="/logo.png" alt="" className="logo"/>
        </div>

        {/* Heading */}
        <h1>Wait! Not Live</h1>

        {/* Description */}
        <p className="subtitle">
          The survey is not live yet.
        </p>

        <p className="description">
          The survey you are trying to reach is not live yet, please try again
          after sometime. Please feel free to try after sometime or contact us{" "}
          <a href="mailto:sp@novametricresearch.com">
            sp@novametricresearch.com
          </a>
        </p>

        {/* Button */}
        <button className="contact-btn">
          ✉ Contact Us
        </button>
      </div>
    </div>
  );
};

export default SurveyNotLive;
