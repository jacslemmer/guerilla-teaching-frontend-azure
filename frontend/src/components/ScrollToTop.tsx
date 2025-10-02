import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();
  const lastPathnameRef = useRef(pathname);

  useEffect(() => {
    console.log('🚨 SCROLLTOTOP TRIGGERED', { pathname, hash, lastPathname: lastPathnameRef.current });

    // TEMPORARILY DISABLED TO TEST SCROLL BEHAVIOR
    // The singleton pattern should handle all scrolling
    console.log('🚨 SCROLLTOTOP: DISABLED - Not interfering with scroll animations');
    return;

    // Original logic kept for reference but not executed
    /*
    // If there's a hash, let the browser handle the anchor navigation
    if (hash) {
      console.log('🚨 SCROLLTOTOP: Hash detected, returning');
      return;
    }

    // Only scroll to top if the pathname actually changed (not just focus/blur events)
    if (pathname !== lastPathnameRef.current) {
      console.log('🚨 SCROLLTOTOP: Pathname changed, checking if safe to scroll');
      lastPathnameRef.current = pathname;

      // CRITICAL: Don't interfere with same-page scroll animations
      // Add a small delay to allow any ongoing animations to complete
      setTimeout(() => {
        // Only scroll to top if we're not in the middle of a scroll animation
        const currentScrollY = window.scrollY;
        console.log('🚨 SCROLLTOTOP: Delayed check - currentScrollY:', currentScrollY);

        // If user is still at the top or very close, proceed with scroll to top
        // If they've scrolled significantly, they probably intended to stay there
        if (currentScrollY < 100) {
          console.log('🚨 SCROLLTOTOP: Safe to scroll to top');
          window.scrollTo(0, 0);
        } else {
          console.log('🚨 SCROLLTOTOP: User has scrolled, not overriding position');
        }
      }, 100);
    } else {
      console.log('🚨 SCROLLTOTOP: Same pathname, ignoring (probably focus/blur event)');
    }
    */
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
