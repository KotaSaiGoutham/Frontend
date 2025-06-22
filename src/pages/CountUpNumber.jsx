import React, { useState, useEffect } from 'react';

function CountUpNumber({ end, start }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // This condition is crucial: animation only runs if 'start' is true
    if (!start) {
      setCount(0); // Reset count if start becomes false again (e.g., if element leaves view and re-enters)
      return;
    }

    let startTimestamp = null;
    const duration = 1500; // animation duration in ms

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end)); // Update count based on progress
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    // Request the first animation frame
    const animationFrameId = requestAnimationFrame(step);

    // Cleanup function: cancel the animation frame if the component unmounts
    return () => cancelAnimationFrame(animationFrameId);

  }, [start, end]); // Dependencies: re-run effect if 'start' or 'end' changes

  return <>{count}</>;
}

export default CountUpNumber;