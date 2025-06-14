import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Attempt to scroll the window
    window.scrollTo(0, 0);

    // Also attempt to scroll the document element (html tag)
    // This is often the actual scrollable element in many setups
    if (document.documentElement) {
      document.documentElement.scrollTo(0, 0);
    }

    // Fallback for body, though less common as main scroll container
    if (document.body) {
      document.body.scrollTo(0, 0);
    }

    // A small timeout as a last resort, in case rendering isn't instant
    // This isn't ideal for performance, but can help diagnose if timing is an issue.
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      if (document.documentElement) {
        document.documentElement.scrollTo(0, 0);
      }
      if (document.body) {
        document.body.scrollTo(0, 0);
      }
    }, 50); // Small delay, e.g., 50 milliseconds

    // Cleanup the timeout if the component unmounts quickly
    return () => clearTimeout(timer);

  }, [pathname]); // Depend on pathname, so it re-runs on route changes

  return null; // This component does not render any UI
}

export default ScrollToTop;