"use client";
import React, { useEffect, useRef } from "react";

export default function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let isDark = document.documentElement.getAttribute("data-theme") === "dark";
    let mouse = { x: -1000, y: -1000 };

    const COUNT = 100;
    const CONN = 130;

    function resize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    class Particle {
      x!: number;
      y!: number;
      vx!: number;
      vy!: number;
      r!: number;
      opacity!: number;
      color!: string;

      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -12;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = Math.random() * 0.35 + 0.08;
        this.r = Math.random() * 1.8 + 0.5;
        this.opacity = Math.random() * 0.55 + 0.1;
        const dark = ["rgba(255,153,51", "rgba(19,136,8", "rgba(255,255,255", "rgba(212,175,55"];
        const light = ["rgba(255,153,51", "rgba(19,136,8", "rgba(212,175,55"];
        const palette = isDark ? dark : light;
        this.color = palette[Math.floor(Math.random() * palette.length)];
      }

      update() {
        // Mouse repel
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 90) {
          const force = (90 - dist) / 90;
          this.vx += (dx / dist) * force * 0.8;
          this.vy += (dy / dist) * force * 0.8;
        }

        // Damping
        this.vx *= 0.96;
        this.vy *= 0.96;
        this.vy = Math.max(this.vy, 0.08);

        this.x += this.vx;
        this.y += this.vy;

        if (this.y > height + 12) this.reset(false);
        if (this.x < -12 || this.x > width + 12) this.x = Math.random() * width;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color},${this.opacity})`;
        ctx.fill();
      }
    }

    function initArray() {
      particles = Array.from({ length: COUNT }, () => new Particle());
    }

    function drawConnections() {
      if (!ctx) return;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < CONN) {
            const alpha = (1 - dist / CONN) * (isDark ? 0.16 : 0.08);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(212,175,55,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    let animationFrameId: number;
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      drawConnections();
      animationFrameId = requestAnimationFrame(animate);
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      resize();
      initArray();
    };

    // Watch for theme updates on documentElement
    const observer = new MutationObserver(() => {
      const nextIsDark = document.documentElement.getAttribute("data-theme") === "dark";
      if (nextIsDark !== isDark) {
        isDark = nextIsDark;
        particles.forEach((p) => p.reset(true));
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize);

    resize();
    initArray();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, []);

  return <canvas id="particle-canvas" ref={canvasRef} />;
}
