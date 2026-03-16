import React, { useRef, useEffect } from "react";
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

  const firstSetRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    if (firstSetRef.current && trackRef.current) {
      const singleSetWidth = firstSetRef.current.scrollWidth;
      trackRef.current.style.setProperty("--single-set-width", `${singleSetWidth}px`);
    }
  }, []);

  return (
    <div className="ticker">
      <div className="ticker-track" ref={trackRef}>
        <div className="ticker-set" ref={firstSetRef}>
          {items.map((item, index) => (
            <span key={index} className="ticker-item">{item}</span>
          ))}
        </div>
        <div className="ticker-set" aria-hidden="true">
          {items.map((item, index) => (
            <span key={index} className="ticker-item">{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}