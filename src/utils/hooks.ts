import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useLayoutEffect, useEffect, type MutableRefObject } from "react";
import Typed from "typed.js";

export const useTyped = (el: MutableRefObject<null>, words: string[]) => {
  useEffect(() => {
    const options = {
      strings: words,
      typeSpeed: 60,
      loop: true,
      backSpeed: 60,
      backDelay: 1500,
      shuffle: true,
    }

    const typed = new Typed(el.current, options)

    return () => {
      typed.destroy();
    }
  }, [el, words])
}

export const useIsDarkMode = () => {
  const [darkMode, setDarkMode] = useState(false);

  const modeMe = (e: MediaQueryListEvent) => {
    setDarkMode(!!e.matches);
  };

  useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");

    setDarkMode(matchMedia.matches);
    matchMedia.addEventListener("change", modeMe);

    return () => matchMedia.removeEventListener("change", modeMe);
  }, []);

  return darkMode;
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
