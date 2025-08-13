"use client";

import { useLayoutEffect } from "react";

export default function SrollFix() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0); // Ensure it scrolls to top
  }, []);

  return <></>;
}
