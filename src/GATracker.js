import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

const GATracker = () => {
  const location = useLocation();

  // This effect runs every time the route (location.pathname) changes
  useEffect(() => {
    // Send the pageview hit to Google Analytics
    ReactGA.send({ 
      hitType: "pageview", 
      page: location.pathname + location.search 
    });
  }, [location]);

  return null; // This component doesn't render anything
};

export default GATracker;