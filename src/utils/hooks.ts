import { useState, useLayoutEffect, useEffect } from "react";
import toast from "react-hot-toast";

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
}

export const useToastError = (isErrorList: boolean[]) => {
  useEffect(() => {
    isErrorList.forEach((isError) => {
      if (isError) {
        return toast.error("An error has occurred. Please try again later.");
      }
    });
  }, [isErrorList]);
}
