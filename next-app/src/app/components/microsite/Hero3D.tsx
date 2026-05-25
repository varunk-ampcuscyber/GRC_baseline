"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Countdown from "../Countdown";

// Magnetic Button handlers
const handleMagneticMove = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
  if (typeof window !== "undefined" && window.innerWidth < 1024) return;
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.22;
  const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
  btn.style.transform = `translate(${dx}px, ${dy}px)`;
  btn.style.transition = "transform 0.1s ease";
};

const handleMagneticReset = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
  const btn = e.currentTarget;
  btn.style.transform = "";
  btn.style.transition = "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)";
};

interface Hero3DProps {
  title: string;
  subtitle: string;
  category: string;
  date: string;
  city: string;
  country: string;
  onRegisterClick: () => void;
}

export default function Hero3D({
  title,
  subtitle,
  category,
  date,
  city,
  country,
  onRegisterClick,
}: Hero3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Handle smooth scroll to Agenda section
  const handleScrollToAgenda = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("agenda");
    if (!target) return;
    const navH = document.getElementById("navbar")?.offsetHeight || 94;
    window.scrollTo({
      top: target.offsetTop - navH,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Track mouse
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Normalize between -1 and 1
      mouseRef.current.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.targetY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Handle resize
    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // 3D Particles Definition
    interface Particle3D {
      x: number;
      y: number;
      z: number;
      color: string;
      size: number;
      speed: number;
      angle: number;
      radius: number;
    }

    const particles: Particle3D[] = [];
    const colors = [
      "rgba(255, 153, 51, 0.75)", // Saffron glow
      "rgba(19, 136, 8, 0.75)",   // Green glow
      "rgba(212, 175, 55, 0.8)",   // Gold spark
      "rgba(255, 255, 255, 0.8)",  // White star
    ];

    // Spawn orbital particle galaxy
    for (let i = 0; i < 180; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 600,
        z: Math.random() * 400 - 200,
        color: colors[i % colors.length],
        size: Math.random() * 2 + 1.2,
        speed: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * 180 + 40,
      });
    }

    let angleY = 0;
    let angleX = 0;

    // Animation Loop
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow interpolation (easing)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      // Base rotations influenced by mouse offset
      angleY += 0.002 + mouseRef.current.x * 0.005;
      angleX = mouseRef.current.y * 0.25;

      const fov = 400; // Camera Field of View depth
      const cx = width * 0.75; // Position 3D reactor on the right side of the screen
      const cy = height * 0.5;

      // Responsive center shifts
      const isMobile = window.innerWidth < 1024;
      const drawCenterX = isMobile ? width * 0.5 : cx;
      const drawCenterY = isMobile ? height * 0.65 : cy;

      // 1. Draw 3D Floating Rotating Ashoka Chakra outline
      const chakraRadius = isMobile ? 100 : 150;
      ctx.strokeStyle = "rgba(212, 175, 55, 0.15)";
      ctx.lineWidth = 1;

      // Project circular rings in 3D perspective
      for (let r = chakraRadius - 10; r <= chakraRadius; r += 5) {
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.1) {
          // 3D coordinates on circular plane
          const px = Math.cos(a) * r;
          const py = 0;
          const pz = Math.sin(a) * r;

          // Rotate coordinate matrix
          // Y-rotation
          let rx = px * Math.cos(angleY * 0.5) - pz * Math.sin(angleY * 0.5);
          let rz = px * Math.sin(angleY * 0.5) + pz * Math.cos(angleY * 0.5);
          // X-rotation
          let ry = py * Math.cos(angleX) - rz * Math.sin(angleX);
          rz = py * Math.sin(angleX) + rz * Math.cos(angleX);

          // Project to 2D
          const scale = fov / (fov + rz);
          const screenX = drawCenterX + rx * scale;
          const screenY = drawCenterY + ry * scale;

          if (a === 0) ctx.moveTo(screenX, screenY);
          else ctx.lineTo(screenX, screenY);
        }
        ctx.stroke();
      }

      // Draw 24 Spoke lines in 3D perspective
      ctx.strokeStyle = "rgba(212, 175, 55, 0.08)";
      for (let i = 0; i < 24; i++) {
        const a = (i * 15 * Math.PI) / 180 + angleY * 0.5;
        const px = Math.cos(a) * chakraRadius;
        const py = 0;
        const pz = Math.sin(a) * chakraRadius;

        let rx = px * Math.cos(angleY * 0.5) - pz * Math.sin(angleY * 0.5);
        let rz = px * Math.sin(angleY * 0.5) + pz * Math.cos(angleY * 0.5);
        let ry = py * Math.cos(angleX) - rz * Math.sin(angleX);
        rz = py * Math.sin(angleX) + rz * Math.cos(angleX);

        const scale = fov / (fov + rz);
        const screenX = drawCenterX + rx * scale;
        const screenY = drawCenterY + ry * scale;

        ctx.beginPath();
        ctx.moveTo(drawCenterX, drawCenterY);
        ctx.lineTo(screenX, screenY);
        ctx.stroke();
      }

      // 2. Draw 3D India Gate Wireframe Silhouette
      const gateHeight = isMobile ? 120 : 180;
      const gateWidth = isMobile ? 80 : 120;
      
      const drawGatePoint = (px: number, py: number, pz: number) => {
        // Rotate on Y and X
        let rx = px * Math.cos(angleY * 0.15) - pz * Math.sin(angleY * 0.15);
        let rz = px * Math.sin(angleY * 0.15) + pz * Math.cos(angleY * 0.15);
        let ry = py * Math.cos(angleX * 0.5) - rz * Math.sin(angleX * 0.5);
        rz = py * Math.sin(angleX * 0.5) + rz * Math.cos(angleX * 0.5);

        const scale = fov / (fov + rz);
        return {
          x: drawCenterX + rx * scale,
          y: drawCenterY + ry * scale - 20,
          scale
        };
      };

      // Draw basic silhouette pillars and arch
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(255, 153, 51, 0.25)"; // Saffron wireglow
      
      // Bottom pedestal
      const p1 = drawGatePoint(-gateWidth/2, gateHeight/2, -10);
      const p2 = drawGatePoint(gateWidth/2, gateHeight/2, -10);
      const p3 = drawGatePoint(gateWidth/2, gateHeight/2, 10);
      const p4 = drawGatePoint(-gateWidth/2, gateHeight/2, 10);

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.closePath();
      ctx.stroke();

      // Top columns
      const t1 = drawGatePoint(-gateWidth/2.5, -gateHeight/2, -10);
      const t2 = drawGatePoint(gateWidth/2.5, -gateHeight/2, -10);
      const t3 = drawGatePoint(gateWidth/2.5, -gateHeight/2, 10);
      const t4 = drawGatePoint(-gateWidth/2.5, -gateHeight/2, 10);

      ctx.beginPath();
      ctx.moveTo(t1.x, t1.y);
      ctx.lineTo(t2.x, t2.y);
      ctx.lineTo(t3.x, t3.y);
      ctx.lineTo(t4.x, t4.y);
      ctx.closePath();
      ctx.stroke();

      // Connecting pillars
      ctx.strokeStyle = "rgba(19, 136, 8, 0.2)"; // Green wireglow
      const midLeftBase = drawGatePoint(-gateWidth/3, gateHeight/2, 0);
      const midLeftTop = drawGatePoint(-gateWidth/3, -gateHeight/3, 0);
      const midRightBase = drawGatePoint(gateWidth/3, gateHeight/2, 0);
      const midRightTop = drawGatePoint(gateWidth/3, -gateHeight/3, 0);

      ctx.beginPath();
      ctx.moveTo(midLeftBase.x, midLeftBase.y);
      ctx.lineTo(midLeftTop.x, midLeftTop.y);
      ctx.moveTo(midRightBase.x, midRightBase.y);
      ctx.lineTo(midRightTop.x, midRightTop.y);
      ctx.stroke();

      // Inner Arch
      ctx.strokeStyle = "rgba(212, 175, 55, 0.3)";
      ctx.beginPath();
      for (let a = Math.PI; a <= Math.PI * 2; a += 0.2) {
        const ax = Math.cos(a) * (gateWidth / 4.5);
        const ay = Math.sin(a) * (gateWidth / 4.5) + gateHeight / 6;
        const pt = drawGatePoint(ax, ay, 0);
        if (a === Math.PI) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();

      // 3. Draw floating tricolor particles
      particles.forEach((p) => {
        // Orbit update
        p.angle += p.speed;
        
        // Circular orbit vectors projected in 3D
        const px = Math.cos(p.angle) * p.radius;
        const pz = Math.sin(p.angle) * p.radius;
        const py = p.y;

        // Apply global matrix rotation
        let rx = px * Math.cos(angleY) - pz * Math.sin(angleY);
        let rz = px * Math.sin(angleY) + pz * Math.cos(angleY);
        let ry = py * Math.cos(angleX) - rz * Math.sin(angleX);
        rz = py * Math.sin(angleX) + rz * Math.cos(angleX);

        // Project
        const scale = fov / (fov + rz);
        const screenX = drawCenterX + rx * scale;
        const screenY = drawCenterY + ry * scale;

        // Glow effects on canvas
        if (screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height) {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(screenX, screenY, p.size * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section id="home" className="hero-section hero-3d-layout">
      {/* 3D WebGL/Canvas viewport */}
      <canvas ref={canvasRef} className="hero-3d-canvas" />

      <div className="hero-bg-grid"></div>
      
      {/* Ambient gradient light glows */}
      <div className="hero-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>

      <div className="hero-content">
        {/* Category Badge */}
        <div className="hero-badge" data-aos="fade-down" data-aos-delay="200">
          <span className="badge-dot"></span>
          <span>{category}</span>
          <span className="badge-div">•</span>
          <span>{city} • {date}</span>
        </div>

        {/* Cinematic Title with Blur-in effect */}
        <h1 className="hero-title" data-aos="fade-up" data-aos-delay="400">
          <span className="gradient-text">India's GRC Leadership</span>
          <br />
          &amp; Cybersecurity
          <br />
          <span className="outline-text">Conclave</span>
        </h1>

        <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="500">
          {subtitle}
        </p>

        {/* Location coordinates pass */}
        <div className="hero-meta" data-aos="fade-up" data-aos-delay="600">
          <div className="meta-item">
            <i className="fas fa-calendar-alt"></i>
            <div>
              <span className="meta-label">Date</span>
              <span className="meta-value">{date}</span>
            </div>
          </div>
          <div className="meta-divider"></div>
          <div className="meta-item">
            <i className="fas fa-map-marker-alt"></i>
            <div>
              <span className="meta-label">City</span>
              <span className="meta-value">{city}, {country}</span>
            </div>
          </div>
          <div className="meta-divider"></div>
          <div className="meta-item">
            <i className="fas fa-users"></i>
            <div>
              <span className="meta-label">Format</span>
              <span className="meta-value">{formatDetails(date)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons with magnetic pulling offsets */}
        <div className="hero-actions" data-aos="fade-up" data-aos-delay="700">
          <button
            type="button"
            className="btn btn-primary btn-glow"
            onMouseMove={handleMagneticMove}
            onMouseLeave={handleMagneticReset}
            onClick={onRegisterClick}
          >
            <span>Register Now</span>
            <i className="fas fa-arrow-right"></i>
          </button>
          <a
            href="#agenda"
            className="btn btn-ghost"
            onMouseMove={handleMagneticMove}
            onMouseLeave={handleMagneticReset}
            onClick={handleScrollToAgenda}
          >
            <span>View Agenda</span>
            <i className="fas fa-chevron-down"></i>
          </a>
        </div>

        {/* Clock Countdown reactor */}
        <Countdown />
      </div>

      <div className="hero-scroll-hint">
        <div className="scroll-arrow"></div>
        <span>Scroll to Explore</span>
      </div>
    </section>
  );
}

// Helpers
function formatDetails(dateStr: string) {
  return "Physical In-Person";
}
