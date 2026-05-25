"use client";
import React, { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show on desktop (>= 1024px)
    if (window.innerWidth < 1024) return;
    setVisible(true);

    let mx = 0, my = 0; // Mouse coords
    let rx = 0, ry = 0; // Ring coords
    let gx = 0, gy = 0; // Glow coords

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let animationFrameId: number;
    const animateCursor = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      const glow = glowRef.current;

      if (dot) {
        dot.style.left = `${mx}px`;
        dot.style.top = `${my}px`;
      }

      if (ring) {
        rx += (mx - rx) * 0.14;
        ry += (my - ry) * 0.14;
        ring.style.left = `${rx}px`;
        ring.style.top = `${ry}px`;
      }

      if (glow) {
        gx += (mx - gx) * 0.06;
        gy += (my - gy) * 0.06;
        glow.style.left = `${gx}px`;
        glow.style.top = `${gy}px`;
      }

      animationFrameId = requestAnimationFrame(animateCursor);
    };

    animateCursor();

    // Scale ring on hovering over specific selectors
    const handleMouseEnter = () => {
      const ring = ringRef.current;
      const dot = dotRef.current;
      if (ring && dot) {
        ring.style.width = "60px";
        ring.style.height = "60px";
        ring.style.borderColor = "rgba(236,72,153,0.6)";
        dot.style.transform = "translate(-50%,-50%) scale(2)";
      }
    };

    const handleMouseLeave = () => {
      const ring = ringRef.current;
      const dot = dotRef.current;
      if (ring && dot) {
        ring.style.width = "36px";
        ring.style.height = "36px";
        ring.style.borderColor = "rgba(167,139,250,0.6)";
        dot.style.transform = "translate(-50%,-50%) scale(1)";
      }
    };

    const setupListeners = () => {
      const interactives = document.querySelectorAll(
        "a, button, .why-card, .acard, .speaker-card, .ticket-card, .audience-card, .pillar, .theme-tag"
      );
      interactives.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });
    };

    // Delay setup slightly to ensure dynamic content has rendered
    const setupTimeout = setTimeout(setupListeners, 1000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(setupTimeout);
    };
  }, []);

  if (!visible) return null;

  return (
    <div id="custom-cursor">
      <div id="cursor-dot" ref={dotRef}></div>
      <div id="cursor-ring" ref={ringRef}></div>
      <div id="cursor-glow" ref={glowRef}></div>
    </div>
  );
}
