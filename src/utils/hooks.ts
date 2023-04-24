import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useLayoutEffect, useEffect } from "react";

export const isDarkMode = () => {
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    return true;
  }
  return false;
}

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

export const useRedirectWithoutSession = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      void router.push("/auth/signin");
    }
  }, [router, session]);

  return session;
};
