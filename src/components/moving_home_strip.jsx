import React from "react";
import Marquee from "react-fast-marquee";
import "../css/moving_home_strip.css";

export default function MovingHomeStrip() {
  const resources = [
    "Health Support",
    "Food Assistance",
    "Education Programs",
    "Youth Services",
    "Legal Aid",
    "Job Opportunities",
    "Mental Wellness",
    "Senior Services",
    "Community Events",
    "Housing Help",
  ];

  return (
    <div className="ticker">
      <Marquee
        speed={46}
        pauseOnHover={true}
        pauseOnClick={true}
        direction="left"
        autoFill={true}
      >
        {resources.map((item, i) => (
          <span key={i} className="ticker-item">
            {item}
          </span>
        ))}
      </Marquee>
    </div>
  );
}