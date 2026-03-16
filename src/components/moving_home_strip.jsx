import React from "react";
import "../css/moving_home_strip.css";

export default function MovingHomeStrip() {
  const items = [
    "features resources 1",
    "features resources 2",
    "features resources 3",
    "features resources 4",
    "features resources 5",
    "features resources 6",
    "features resources 7",
    "features resources 8",
  ];

  return (
    <div className="ticker">
      <div className="ticker-track">
        {items.concat(items).map((item, index) => (
          <span key={index} className="ticker-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}