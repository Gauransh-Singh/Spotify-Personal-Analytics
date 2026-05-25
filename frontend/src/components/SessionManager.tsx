"use client";
import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function SessionManager() {
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes

    const checkTimeout = () => {
      const lastActive = sessionStorage.getItem('lastActiveTime');
      if (lastActive) {
        const timeSinceActive = Date.now() - parseInt(lastActive, 10);
        if (timeSinceActive > TIMEOUT_MS && pathnameRef.current !== '/') {
          router.push('/');
        }
      }
      sessionStorage.setItem('lastActiveTime', Date.now().toString());
    };

    // Check immediately on load
    checkTimeout();

    // Check when user switches back to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkTimeout();
      }
    };

    // Keep session alive on interaction
    const updateActivity = () => {
      sessionStorage.setItem('lastActiveTime', Date.now().toString());
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Throttle the activity updates to avoid hammering sessionStorage
    let throttleTimer: any;
    const throttledUpdate = () => {
      if (!throttleTimer) {
        throttleTimer = setTimeout(() => {
          updateActivity();
          throttleTimer = null;
        }, 1000);
      }
    };

    window.addEventListener('mousemove', throttledUpdate);
    window.addEventListener('keydown', throttledUpdate);
    window.addEventListener('click', throttledUpdate);
    window.addEventListener('scroll', throttledUpdate);

    // Periodically check if idle while tab is open and active
    const interval = setInterval(() => {
      const lastActive = sessionStorage.getItem('lastActiveTime');
      if (lastActive) {
        const timeSinceActive = Date.now() - parseInt(lastActive, 10);
        if (timeSinceActive > TIMEOUT_MS && pathnameRef.current !== '/') {
          router.push('/');
        }
      }
    }, 5000); // Check every 5 seconds

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mousemove', throttledUpdate);
      window.removeEventListener('keydown', throttledUpdate);
      window.removeEventListener('click', throttledUpdate);
      window.removeEventListener('scroll', throttledUpdate);
      clearInterval(interval);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, [router]);

  return null;
}
