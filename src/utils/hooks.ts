import { useState, useLayoutEffect } from "react";

export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};

export const useCookieConsent = () => {
  const [cookieConsent, setCookieConsent] = useState<{
    required: boolean;
    optional: boolean;
  } | null>(null);
  return [cookieConsent, setCookieConsent];
}
