import React from "react";
import Marquee from "react-fast-marquee";
import "../css/moving_home_strip.css";

export default function MovingHomeStrip() {
  const resources = [
    "Resource 1",
    "Resource 2",
    "Resource 3",
    "Resource 4",
    "Resource 5",
    "Resource 6",
    "Resource 7",
    "Resource 8",
    "Resource 9",
    "Resource 10"
  ];

  return (
    <div className="ticker">
      <Marquee speed = {80} pauseOnHover = {true}>
        {resources.map((item, i) => (
          <span key={i} className="ticker-item">
            {item}
          </span>
        ))}
      </Marquee>
    </div>
  );
}