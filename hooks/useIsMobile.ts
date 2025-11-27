"use client";

import { useEffect, useState } from "react";

/**
 * Small helper hook used to cap fragment count on smaller screens.
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => {
      if (typeof window === "undefined") return;
      setIsMobile(window.innerWidth < breakpoint);
    };

    update();
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, [breakpoint]);

  return isMobile;
}
