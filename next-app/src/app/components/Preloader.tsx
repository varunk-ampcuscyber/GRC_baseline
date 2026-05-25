"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function Preloader() {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    // Lock scroll on mount
    document.body.style.overflow = "hidden";

    const hideTimeout = setTimeout(() => {
      setHidden(true);
      document.body.style.overflow = "";
    }, 2400);

    const removeTimeout = setTimeout(() => {
      setRemoved(true);
    }, 3200); // Wait for transition opacity 0.8s to finish

    return () => {
      clearTimeout(hideTimeout);
      clearTimeout(removeTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  if (removed) return null;

  return (
    <div id="preloader" className={hidden ? "hidden" : ""}>
      <div className="preloader-inner">
        <div className="preloader-logo">
          <Image
            src="/images/logo-light.webp"
            alt="GRC Asia Conclave"
            width={300}
            height={75}
            priority
          />
        </div>
        <div className="preloader-bar">
          <div className="preloader-fill"></div>
        </div>
        <p className="preloader-text">Initializing Conclave Experience…</p>
      </div>
    </div>
  );
}
