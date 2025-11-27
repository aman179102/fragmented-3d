"use client";

import { useEffect, useState } from "react";
import { clamp01, easeInOutCubic } from "@/utils/easing";

/**
 * Tracks normalized scroll progress across the document and maps it
 * to a derived fragmentation intensity. Both values are in [0, 1].
 */
export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const computeProgress = () => {
      if (typeof window === "undefined") return;
      const { scrollY, innerHeight } = window;
      const doc = document.documentElement;
      const totalScrollable = doc.scrollHeight - innerHeight;
      const raw = totalScrollable > 0 ? scrollY / totalScrollable : 0;
      setScrollProgress(clamp01(raw));
    };

    computeProgress();

    window.addEventListener("scroll", computeProgress, { passive: true });
    window.addEventListener("resize", computeProgress);

    return () => {
      window.removeEventListener("scroll", computeProgress);
      window.removeEventListener("resize", computeProgress);
    };
  }, []);

  // Emphasize fragmentation effect in the second half of the scroll.
  const fragmentIntensity = easeInOutCubic(clamp01(scrollProgress * 1.3));

  return {
    scrollProgress,
    fragmentIntensity,
  };
}
