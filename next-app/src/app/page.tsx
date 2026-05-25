"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Script from "next/script";

// Custom components
import Preloader from "./components/Preloader";
import ParticlesCanvas from "./components/ParticlesCanvas";
import Countdown from "./components/Countdown";
import CustomCursor from "./components/CustomCursor";
import EnquiryModal from "./components/EnquiryModal";

// 3D Card Tilt handlers
const handleCardTilt = (e: React.MouseEvent<HTMLDivElement>) => {
  if (window.innerWidth < 768) return;
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = (e.clientX - cx) / (rect.width / 2);
  const dy = (e.clientY - cy) / (rect.height / 2);
  const tiltX = dy * -8;
  const tiltY = dx * 8;
  card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
  card.style.transition = "transform 0.1s ease";
};

const handleCardReset = (e: React.MouseEvent<HTMLDivElement>) => {
  const card = e.currentTarget;
  card.style.transform = "";
  card.style.transition = "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)";
};

// Magnetic Button handlers
const handleMagneticMove = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
  if (window.innerWidth < 1024) return;
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

// Stats item helper
const StatItem = ({
  target,
  plus,
  label,
  isCenter = false,
}: {
  target: number;
  plus: string;
  label: string;
  isCenter?: boolean;
}) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let start = 0;
            const end = target;
            const duration = 1800;
            const t0 = performance.now();

            const step = (now: number) => {
              const p = Math.min((now - t0) / duration, 1);
              const e = 1 - Math.pow(1 - p, 4); // ease-out-quart
              setCount(Math.round(start + (end - start) * e));
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [target]);

  return (
    <div
      className={`ns-item ${isCenter ? "ns-center-item" : ""}`}
      onMouseMove={handleCardTilt}
      onMouseLeave={handleCardReset}
    >
      <div className="ns-value-wrap">
        <span className="stat-num ns-num" ref={elementRef}>
          {count}
        </span>
        <span className="ns-plus">{plus}</span>
      </div>
      <div className="ns-label">{label}</div>
      {isCenter && <div className="ns-pulse-dot"></div>}
    </div>
  );
};

export default function Home() {
  const [theme, setTheme] = useState("dark");
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState("0%");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  
  // Newsletter variables
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "success">("idle");

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Load and apply theme from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem("grc-theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("grc-theme", nextTheme);
  };

  // Scroll listeners
  useEffect(() => {
    const handleScroll = () => {
      // Progress bar
      const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setScrollProgress(`${Math.min(pct, 100)}%`);

      // Navbar
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection observer for navigation active states
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.getAttribute("id") || "");
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Smooth scroll helper
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const navH = document.getElementById("navbar")?.offsetHeight || 94;
    window.scrollTo({
      top: target.offsetTop - navH,
      behavior: "smooth",
    });
    setMenuOpen(false);
  };

  // Newsletter submission
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setNewsletterStatus("success");
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
    } catch (err) {
      // Silent error
    }

    setNewsletterEmail("");
    setTimeout(() => {
      setNewsletterStatus("idle");
    }, 3000);
  };

  const themeTags = [
    "AI in Cybersecurity",
    "Cyber Risk Quantification",
    "Continuous Compliance",
    "DPDP Act",
    "Cloud Security",
    "AI Resilience",
    "Threat Intelligence",
    "TPRM",
    "Ransomware",
    "Identity & Access",
    "Incident Response",
    "Data Privacy",
    "Digital Forensics",
    "GRC",
    "Security Testing",
    "InfoSec",
  ];

  const tagColors = [
    ["rgba(255,153,51,1)", "rgba(212,175,55,1)"],
    ["rgba(212,175,55,1)", "rgba(19,136,8,1)"],
    ["rgba(255,255,255,1)", "rgba(255,153,51,1)"],
    ["rgba(255,153,51,1)", "rgba(19,136,8,1)"],
    ["rgba(212,175,55,1)", "rgba(255,255,255,1)"],
  ];

  const faqs = [
    {
      q: "What is the GRC Asia Conclave - India 2026?",
      a: "It is an exclusive, invitation-only executive summit for Governance, Risk & Compliance professionals, CISOs, enterprise policy-makers, and security leaders hosted by Ampcus Cyber. The event addresses cutting-edge strategies in cybersecurity, DPDPA implementation, and AI governance."
    },
    {
      q: "Who is eligible to attend?",
      a: "Attendance is structured specifically for C-suite risk heads, Chief Information Security Officers (CISOs), risk managers, CTOs, CIOs, financial policy regulators, law enforcement, and government leaders."
    },
    {
      q: "Is there a fee to register?",
      a: "Initial interest registrations are complimentary but subject to rigorous evaluation by the Ampcus Cyber board due to restricted invitation slots. Successful delegates will receive a formal invite pass."
    },
    {
      q: "What is the format of the event?",
      a: "The conclave is a comprehensive one-day, physical, in-person summit in Mumbai featuring strategic panels, keynote briefs, technology showcases, executive roundtables, and VIP high-tea networking."
    },
    {
      q: "Will there be certifications?",
      a: "Yes! All confirmed delegates who attend the sessions will be awarded official Governance, Risk & Compliance CPE certification hours upon completion."
    }
  ];

  return (
    <>
      {/* 1. Preloader Screen */}
      <Preloader />

      {/* Scroll Progress line */}
      <div id="scroll-progress" style={{ width: scrollProgress }} />

      {/* 2. Particle canvas */}
      <ParticlesCanvas />

      {/* Custom Mouse Cursor */}
      <CustomCursor />

      {/* 3. Navigation Header */}
      <nav id="navbar" className={scrolled ? "scrolled" : ""}>
        <div className="nav-container">
          <a href="#home" className="nav-logo" onClick={(e) => handleScrollTo(e, "home")}>
            <Image
              src="/images/logo-light.webp"
              alt="GRC Conclave"
              className="logo-dark-img"
              width={260}
              height={65}
              priority
            />
            <Image
              src="/images/logo-dark.webp"
              alt="GRC Conclave"
              className="logo-light-img"
              width={260}
              height={65}
              priority
            />
          </a>

          <ul className={`nav-links ${menuOpen ? "open" : ""}`} id="nav-links">
            <li>
              <a
                href="#about"
                className={`nav-link ${activeSection === "about" ? "active" : ""}`}
                onClick={(e) => handleScrollTo(e, "about")}
              >
                Overview
              </a>
            </li>
            <li>
              <a
                href="#why-attend"
                className={`nav-link ${activeSection === "why-attend" ? "active" : ""}`}
                onClick={(e) => handleScrollTo(e, "why-attend")}
              >
                Why Attend
              </a>
            </li>
            <li>
              <a
                href="#speakers"
                className={`nav-link ${activeSection === "speakers" ? "active" : ""}`}
                onClick={(e) => handleScrollTo(e, "speakers")}
              >
                Speakers
              </a>
            </li>
            <li>
              <a
                href="#agenda"
                className={`nav-link ${activeSection === "agenda" ? "active" : ""}`}
                onClick={(e) => handleScrollTo(e, "agenda")}
              >
                Agenda
              </a>
            </li>
            <li>
              <a
                href="#sponsors"
                className={`nav-link ${activeSection === "sponsors" ? "active" : ""}`}
                onClick={(e) => handleScrollTo(e, "sponsors")}
              >
                Partners
              </a>
            </li>
            <li>
              <a
                href="#venue"
                className={`nav-link ${activeSection === "venue" ? "active" : ""}`}
                onClick={(e) => handleScrollTo(e, "venue")}
              >
                Venue
              </a>
            </li>
            <li>
              <a
                href="#register"
                className="nav-link nav-cta-link"
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticReset}
                onClick={(e) => {
                  e.preventDefault();
                  setModalOpen(true);
                }}
              >
                Register Now
              </a>
            </li>
          </ul>

          <div className="nav-actions">
            {/* Theme Toggle */}
            <button className="theme-toggle" id="themeToggle" onClick={toggleTheme} aria-label="Toggle theme">
              <span className="toggle-icon sun">
                <i className="fas fa-sun"></i>
              </span>
              <span className="toggle-icon moon">
                <i className="fas fa-moon"></i>
              </span>
              <span className="toggle-ball"></span>
            </button>

            {/* Hamburger button */}
            <button
              className={`hamburger ${menuOpen ? "open" : ""}`}
              id="hamburger"
              aria-label="Menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* 4. Cinematic India + Delhi Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-bg-grid"></div>
        <div className="hero-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
        </div>
        
        {/* Stylized custom India Gate inline backdrop SVG */}
        <div className="monument-backdrop">
          <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%", fill: "var(--brand-gold)", opacity: 0.8 }}>
            <path d="M40,190 h120 v-10 h-10 v-30 h-15 v30 h-70 v-30 h-15 v30 h-10 Z" />
            <path d="M55,150 h90 v-40 h-90 Z" />
            <path d="M55,110 h20 v-35 h-20 Z M125,110 h20 v-35 h-20 Z" />
            <path d="M75,110 A25,25 0 0,1 125,110" fill="none" stroke="var(--brand-gold)" strokeWidth="15" />
            <path d="M50,75 h100 v-8 h-100 Z" />
            <path d="M60,67 h80 v-25 h-80 Z" />
            <path d="M55,42 h90 v-6 h-90 Z" />
            <path d="M75,36 h50 c0,-15 -50,-15 -50,0 Z" />
          </svg>
        </div>

        {/* Rotating spinning Ashoka Chakra vector background */}
        <div className="floating-chakra-wrap">
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", stroke: "var(--brand-gold)", fill: "none", strokeWidth: 0.5 }}>
            <circle cx="50" cy="50" r="45" strokeDasharray="1,1" />
            <circle cx="50" cy="50" r="40" />
            <circle cx="50" cy="50" r="8" strokeWidth="1" />
            <circle cx="50" cy="50" r="2" fill="var(--brand-gold)" />
            {Array.from({ length: 24 }).map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={50 + 38 * Math.cos((i * 15 * Math.PI) / 180)}
                y2={50 + 38 * Math.sin((i * 15 * Math.PI) / 180)}
              />
            ))}
          </svg>
        </div>

        <div className="hero-content">
          <div className="hero-logo-wrap" data-aos="zoom-in" data-aos-delay="300">
            <Image
              src="/images/logo-light.webp"
              alt="GRC Asia Conclave"
              className="hero-logo logo-dark-img"
              width={280}
              height={80}
            />
            <Image
              src="/images/logo-dark.webp"
              alt="GRC Asia Conclave"
              className="hero-logo logo-light-img"
              width={280}
              height={80}
            />
          </div>

          <h1 className="hero-title" data-aos="fade-up" data-aos-delay="400">
            <span className="gradient-text">India's GRC Leadership</span>
            <br />
            &amp; Cybersecurity
            <br />
            <span className="outline-text">Conclave</span>
          </h1>

          <div className="hero-badge" data-aos="fade-down" data-aos-delay="200">
            <span className="badge-dot"></span>
            <span>Mumbai • 27 June 2026</span>
          </div>

          <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="500">
            India's digital future meets executive policy governance. A landmark event where policy regulators, 
            corporate risk heads, and AI creators unite to forge trusted compliance.
          </p>

          <div className="hero-meta" data-aos="fade-up" data-aos-delay="600">
            <div className="meta-item">
              <i className="fas fa-calendar-alt"></i>
              <div>
                <span className="meta-label">Date</span>
                <span className="meta-value">27 June 2026</span>
              </div>
            </div>
            <div className="meta-divider"></div>
            <div className="meta-item">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <span className="meta-label">City</span>
                <span className="meta-value">Mumbai, India</span>
              </div>
            </div>
            <div className="meta-divider"></div>
            <div className="meta-item">
              <i className="fas fa-users"></i>
              <div>
                <span className="meta-label">Audience</span>
                <span className="meta-value">CISOs &amp; Leaders</span>
              </div>
            </div>
          </div>

          <div className="hero-actions" data-aos="fade-up" data-aos-delay="700">
            <a
              href="#register"
              className="btn btn-primary btn-glow"
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticReset}
              onClick={(e) => {
                e.preventDefault();
                setModalOpen(true);
              }}
            >
              <span>Register Now</span>
              <i className="fas fa-arrow-right"></i>
            </a>
            <a
              href="#agenda"
              className="btn btn-ghost"
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticReset}
              onClick={(e) => handleScrollTo(e, "agenda")}
            >
              <span>View Agenda</span>
              <i className="fas fa-chevron-down"></i>
            </a>
          </div>

          {/* Countdown Clock */}
          <Countdown />
        </div>

        <div className="hero-scroll-hint">
          <div className="scroll-arrow"></div>
          <span>Scroll to Explore</span>
        </div>
      </section>

      {/* 5. Nexus Stats Showcase */}
      <section className="nexus-stats-section">
        <div className="ns-ambient-glow"></div>
        <div className="container">
          <div className="ns-container">
            <div className="ns-core-bg">
              <div className="ns-ring ns-ring-1"></div>
              <div className="ns-ring ns-ring-2"></div>
            </div>

            <div className="ns-grid">
              <StatItem target={500} plus="+" label="Leading Clients" />
              <StatItem target={99} plus=".9%" label="Threat Deflection" />
              <StatItem target={24} plus="/7" label="Active Monitoring" isCenter={true} />
              <StatItem target={120} plus="+" label="Global Experts" />
              <StatItem target={18} plus="+" label="Countries Served" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Event Detail Cards Section */}
      <section className="section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">Conclave Metrics</span>
            <h2 className="section-title">
              Event <span className="gradient-text">Coordinates</span>
            </h2>
            <p className="section-desc">Instantly locate key timelines, venues, and registration availability for GRC 2026.</p>
          </div>

          <div className="event-details-grid">
            {/* Card 1 */}
            <div className="detail-card glass" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
              <div className="card-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <h3>Date</h3>
              <p>27 June 2026</p>
              <small>Monday Session</small>
              {/* Ashoka chakra watermark */}
              <svg viewBox="0 0 100 100" className="card-watermark" style={{ stroke: "var(--brand-gold)", fill: "none", strokeWidth: 0.6 }}>
                <circle cx="50" cy="50" r="42" />
                {Array.from({ length: 24 }).map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={50 + 40 * Math.cos((i * 15 * Math.PI) / 180)}
                    y2={50 + 40 * Math.sin((i * 15 * Math.PI) / 180)}
                  />
                ))}
              </svg>
            </div>

            {/* Card 2 */}
            <div className="detail-card glass" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
              <div className="card-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h3>Time</h3>
              <p>8:30 AM to 6:30 PM</p>
              <small>Indian Standard Time</small>
              <svg viewBox="0 0 100 100" className="card-watermark" style={{ stroke: "var(--brand-gold)", fill: "none", strokeWidth: 0.6 }}>
                <circle cx="50" cy="50" r="42" />
                {Array.from({ length: 24 }).map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={50 + 40 * Math.cos((i * 15 * Math.PI) / 180)}
                    y2={50 + 40 * Math.sin((i * 15 * Math.PI) / 180)}
                  />
                ))}
              </svg>
            </div>

            {/* Card 3 */}
            <div className="detail-card glass" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
              <div className="card-icon">
                <i className="fas fa-hourglass-half"></i>
              </div>
              <h3>Duration</h3>
              <p>1 Full Day</p>
              <small>Power-Packed Sessions</small>
              <svg viewBox="0 0 100 100" className="card-watermark" style={{ stroke: "var(--brand-gold)", fill: "none", strokeWidth: 0.6 }}>
                <circle cx="50" cy="50" r="42" />
                {Array.from({ length: 24 }).map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={50 + 40 * Math.cos((i * 15 * Math.PI) / 180)}
                    y2={50 + 40 * Math.sin((i * 15 * Math.PI) / 180)}
                  />
                ))}
              </svg>
            </div>

            {/* Card 4 */}
            <div className="detail-card glass" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
              <div className="card-icon">
                <i className="fas fa-hotel"></i>
              </div>
              <h3>Venue</h3>
              <p>5-Star Premium (TBA)</p>
              <small>Announcing Shortly</small>
              <svg viewBox="0 0 100 100" className="card-watermark" style={{ stroke: "var(--brand-gold)", fill: "none", strokeWidth: 0.6 }}>
                <circle cx="50" cy="50" r="42" />
                {Array.from({ length: 24 }).map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={50 + 40 * Math.cos((i * 15 * Math.PI) / 180)}
                    y2={50 + 40 * Math.sin((i * 15 * Math.PI) / 180)}
                  />
                ))}
              </svg>
            </div>

            {/* Card 5 */}
            <div className="detail-card glass" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
              <div className="card-icon">
                <i className="fas fa-city"></i>
              </div>
              <h3>City</h3>
              <p>Delhi, India</p>
              <small>National Capital Region</small>
              <svg viewBox="0 0 100 100" className="card-watermark" style={{ stroke: "var(--brand-gold)", fill: "none", strokeWidth: 0.6 }}>
                <circle cx="50" cy="50" r="42" />
                {Array.from({ length: 24 }).map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={50 + 40 * Math.cos((i * 15 * Math.PI) / 180)}
                    y2={50 + 40 * Math.sin((i * 15 * Math.PI) / 180)}
                  />
                ))}
              </svg>
            </div>

            {/* Card 6 */}
            <div className="detail-card glass" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
              <div className="card-icon">
                <i className="fas fa-user-tie"></i>
              </div>
              <h3>Speaker/Trainer</h3>
              <p>Top Cyber Architects</p>
              <small>RBI &amp; Government Bodies</small>
              <svg viewBox="0 0 100 100" className="card-watermark" style={{ stroke: "var(--brand-gold)", fill: "none", strokeWidth: 0.6 }}>
                <circle cx="50" cy="50" r="42" />
                {Array.from({ length: 24 }).map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={50 + 40 * Math.cos((i * 15 * Math.PI) / 180)}
                    y2={50 + 40 * Math.sin((i * 15 * Math.PI) / 180)}
                  />
                ))}
              </svg>
            </div>

            {/* Card 7 */}
            <div className="detail-card glass" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
              <div className="card-icon">
                <i className="fas fa-network-wired"></i>
              </div>
              <h3>Format</h3>
              <p>Physical In-Person</p>
              <small>Roundtables &amp; Briefs</small>
              <svg viewBox="0 0 100 100" className="card-watermark" style={{ stroke: "var(--brand-gold)", fill: "none", strokeWidth: 0.6 }}>
                <circle cx="50" cy="50" r="42" />
                {Array.from({ length: 24 }).map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={50 + 40 * Math.cos((i * 15 * Math.PI) / 180)}
                    y2={50 + 40 * Math.sin((i * 15 * Math.PI) / 180)}
                  />
                ))}
              </svg>
            </div>

            {/* Card 8 */}
            <div className="detail-card glass" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
              <div className="card-icon">
                <i className="fas fa-info-circle"></i>
              </div>
              <h3>Registration Status</h3>
              <p>Invites Open</p>
              <small>Limited Executive Slots</small>
              <svg viewBox="0 0 100 100" className="card-watermark" style={{ stroke: "var(--brand-gold)", fill: "none", strokeWidth: 0.6 }}>
                <circle cx="50" cy="50" r="42" />
                {Array.from({ length: 24 }).map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={50 + 40 * Math.cos((i * 15 * Math.PI) / 180)}
                    y2={50 + 40 * Math.sin((i * 15 * Math.PI) / 180)}
                  />
                ))}
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Overview Section */}
      <section id="about" className="section about-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">Overview</span>
            <h2 className="section-title">
              Architecting India's <span className="gradient-text">Digital Defense</span>
            </h2>
            <p className="section-desc">A landmark summit shaping the future of cybersecurity and GRC leadership in Asia.</p>
          </div>

          <div className="about-grid">
            <div className="about-text" data-aos="fade-right">
              <p className="about-lead">
                The <strong>GRC Asia Conclave - India</strong> is an exclusive, invitation-only event for Governance, Risk &amp; Compliance
                professionals hosted by Ampcus Cyber. Held in the financial capital of India, Mumbai, this one-day
                power-packed summit aimed to boost the <span className="highlight-gold">India AI Mission &amp; Strengthen National Cybersecurity Strategy</span>.
              </p>
              <p>
                The event intends to assemble those who matter most when it comes to India's digital safety such as senior
                government officials, regulators, law enforcement leaders, and enterprise cybersecurity experts.
              </p>
              <p>
                The event brings out boardroom-level policy discussions, national conversations, and strategic decisions
                focused to lead the real-world outcomes. The purpose of the GRC Asia Conclave is to bring together the
                leaders who make the policies &amp; standards to defend against threats.
              </p>
            </div>

            <div className="about-visual" data-aos="fade-left" data-aos-delay="200">
              {/* Lotus Temple geometric line art watermark background */}
              <div className="monument-outline-wrap">
                <svg viewBox="0 0 100 80" style={{ width: "240px", height: "240px", stroke: "var(--brand-gold)", fill: "none", strokeWidth: 0.8 }}>
                  <path d="M50,15 C55,35 65,45 80,65 C60,65 55,55 50,45 C45,55 40,65 20,65 C35,45 45,35 50,15 Z" />
                  <path d="M50,30 C58,45 70,55 88,70 C70,70 60,60 50,52 C40,60 30,70 12,70 C30,55 42,45 50,30 Z" />
                  <path d="M50,42 C62,55 78,65 96,75 C78,75 66,68 50,60 C34,68 22,75 4,75 C22,65 38,55 50,42 Z" />
                </svg>
              </div>

              <div className="glass-arch-card glass">
                <div className="arch-header">
                  <i className="fas fa-award"></i>
                  <h4>C-Suite Forums</h4>
                </div>
                <p>
                  From boardroom-level regulatory compliance framing to cross-border secure architectures. The Conclave represents
                  where policy transitions into frontline action.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Why Attend Section */}
      <section id="why-attend" className="section why-section">
        <div className="why-bg-pattern"></div>
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">Value Proposition</span>
            <h2 className="section-title">
              An Unmissable <span className="gradient-text">Experience</span>
            </h2>
          </div>

          <div className="why-grid">
            {/* Card 1 */}
            <div
              className="why-card glass"
              data-aos="fade-up"
              data-aos-delay="0"
              data-num="01"
              onMouseMove={handleCardTilt}
              onMouseLeave={handleCardReset}
            >
              <div className="why-icon">
                <i className="fas fa-user-shield"></i>
              </div>
              <h3>Top-Tier Speakers</h3>
              <p>
                India's most senior CISOs, policy-makers, regulatory heads, and cybersecurity architects sharing the
                insights, strategies, and foresight.
              </p>
            </div>

            {/* Card 2 */}
            <div
              className="why-card glass"
              data-aos="fade-up"
              data-aos-delay="100"
              data-num="02"
              onMouseMove={handleCardTilt}
              onMouseLeave={handleCardReset}
            >
              <div className="why-icon">
                <i className="fas fa-network-wired"></i>
              </div>
              <h3>Strategic Networking</h3>
              <p>
                Policymakers, CISOs, regulators, law enforcement leaders, and enterprise security heads, all in one space.
                The partnerships forged here shape how India defends itself for years to come.
              </p>
            </div>

            {/* Card 3 */}
            <div
              className="why-card glass"
              data-aos="fade-up"
              data-aos-delay="200"
              data-num="03"
              onMouseMove={handleCardTilt}
              onMouseLeave={handleCardReset}
            >
              <div className="why-icon">
                <i className="fas fa-brain"></i>
              </div>
              <h3>Actionable Intelligence</h3>
              <p>
                National-level frameworks, battle-tested strategies, and frontline threat intelligence, delivered by the
                people who built them &amp; designed for leaders who need to implement them tomorrow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Key Takeaways Section */}
      <section className="section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">Key Takeaways</span>
            <h2 className="section-title">
              What You Will <span className="gradient-text">Gain</span>
            </h2>
            <p className="section-desc">Unlock advanced strategic compliance tools and frameworks through focused, expert-led breakouts.</p>
          </div>

          <div className="takeaway-grid">
            <div className="takeaway-card glass" data-aos="fade-up" data-aos-delay="0">
              <h4>Digital India Outlook</h4>
              <p>Understand the intersection of the India AI Mission, local cloud data boundaries, and safe digital infrastructure.</p>
            </div>
            <div className="takeaway-card glass" data-aos="fade-up" data-aos-delay="100">
              <h4>DPDPA Compliance Map</h4>
              <p>Practical consent management structures, data fiduciary duties, and compliance pipelines to meet the DPDPA 2023 regulations.</p>
            </div>
            <div className="takeaway-card glass" data-aos="fade-up" data-aos-delay="200">
              <h4>Continuous Assurance Models</h4>
              <p>Transition from periodic cybersecurity audits to continuous, automated compliance mechanisms to secure fast systems.</p>
            </div>
            <div className="takeaway-card glass" data-aos="fade-up" data-aos-delay="300">
              <h4>Threat Intelligence Models</h4>
              <p>Establish early threat detection structures and secure immediate 6-hour incident report procedures matching CERT-In specs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Agenda / Timeline Section */}
      <section id="agenda" className="section agenda-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">Programme</span>
            <h2 className="section-title">
              Event <span className="gradient-text">Agenda</span>
            </h2>
          </div>

          <div className="agenda-timeline">
            {/* Timeline Item */}
            <div className="agenda-item" data-aos="fade-up">
              <div className="agenda-time">
                8.30 AM
                <br />
                to
                <br />
                9.30 AM
              </div>
              <div className="agenda-content">
                <div className="agenda-dot"></div>
                <div className="agenda-body glass">
                  <span className="agenda-type reg">Registration</span>
                  <h4>Registration &amp; Networking Mingle</h4>
                  <p>Organic Guests Discussion</p>
                </div>
              </div>
            </div>

            <div className="agenda-item agenda-block-header" data-aos="fade-up" data-aos-delay="50">
              <div className="agenda-time">
                9.30 AM
                <br />
                to
                <br />
                1.00 PM
              </div>
              <div className="agenda-content">
                <div className="agenda-dot"></div>
                <div className="agenda-body glass">
                  <h4>MORNING BLOCK</h4>
                </div>
              </div>
            </div>

            <div className="agenda-item" data-aos="fade-up" data-aos-delay="100">
              <div className="agenda-time">
                9.30 AM
                <br />
                to
                <br />
                9.45 AM
              </div>
              <div className="agenda-content">
                <div className="agenda-dot"></div>
                <div className="agenda-body glass">
                  <span className="agenda-type keynote">Welcome</span>
                  <h4>Welcome Address &amp; Setting the Stage</h4>
                  <p>The Central Argument over India's GRC Moment</p>
                </div>
              </div>
            </div>

            <div className="agenda-item" data-aos="fade-up" data-aos-delay="150">
              <div className="agenda-time">
                9.45 AM
                <br />
                to
                <br />
                10.10 AM
              </div>
              <div className="agenda-content">
                <div className="agenda-dot"></div>
                <div className="agenda-body glass">
                  <span className="agenda-type keynote">Inauguration</span>
                  <h4>Chief Guest Address + Lamp Lighting Ceremony</h4>
                  <p>Formal Inauguration of the Event</p>
                </div>
              </div>
            </div>

            <div className="agenda-item" data-aos="fade-up" data-aos-delay="200">
              <div className="agenda-time">
                10.10 AM
                <br />
                to
                <br />
                10.40 AM
              </div>
              <div className="agenda-content">
                <div className="agenda-dot"></div>
                <div className="agenda-body glass">
                  <span className="agenda-type session">Session</span>
                  <h4>India's Digital Risk Reckoning - Why GRC Can No Longer Wait</h4>
                  <p>High-energy, data-driven problem framing</p>
                </div>
              </div>
            </div>

            <div className="agenda-item" data-aos="fade-up" data-aos-delay="250">
              <div className="agenda-time">
                10.40 AM
                <br />
                to
                <br />
                11.10 AM
              </div>
              <div className="agenda-content">
                <div className="agenda-dot"></div>
                <div className="agenda-body glass">
                  <span className="agenda-type keynote">Keynote</span>
                  <h4>Regulatory Expectations in the Age of AI - An RBI Perspective</h4>
                  <p>RBI expectations on AI governance clarified</p>
                </div>
              </div>
            </div>

            <div className="agenda-item" data-aos="fade-up" data-aos-delay="300">
              <div className="agenda-time">
                11.10 AM
                <br />
                to
                <br />
                11.20 AM
              </div>
              <div className="agenda-content">
                <div className="agenda-dot"></div>
                <div className="agenda-body glass">
                  <span className="agenda-type break">Buffer</span>
                  <h4>Transition &amp; Q&amp;A Buffer</h4>
                </div>
              </div>
            </div>

            <div className="agenda-item" data-aos="fade-up" data-aos-delay="350">
              <div className="agenda-time">
                11.20 AM
                <br />
                to
                <br />
                12.05 PM
              </div>
              <div className="agenda-content">
                <div className="agenda-dot"></div>
                <div className="agenda-body glass">
                  <span className="agenda-type panel">Panel</span>
                  <h4>Panel 1: AI, Regulation &amp; the Future of GRC in Indian Financial Services</h4>
                  <p>Top quoted session, DSCI moderates</p>
                </div>
              </div>
            </div>

            <div className="agenda-item" data-aos="fade-up" data-aos-delay="400">
              <div className="agenda-time">
                12.05 PM
                <br />
                to
                <br />
                12.35 PM
              </div>
              <div className="agenda-content">
                <div className="agenda-dot"></div>
                <div className="agenda-body glass">
                  <span className="agenda-type keynote">Keynote 3</span>
                  <h4>Keynote 3: &quot;CERT-In &amp; the Evolving AI Threat Landscape&quot;</h4>
                  <p>Operationalizing six-hour AI threat reporting</p>
                </div>
              </div>
            </div>

            <div className="agenda-item" data-aos="fade-up" data-aos-delay="450">
              <div className="agenda-time">
                12.35 PM
                <br />
                to
                <br />
                12.55 PM
              </div>
              <div className="agenda-content">
                <div className="agenda-dot"></div>
                <div className="agenda-body glass">
                  <span className="agenda-type keynote">Keynote 4</span>
                  <h4>Keynote 4: &quot;Governing AI — India's National Policy Perspective&quot;</h4>
                  <p>Government-led vision: Digital India, AI Mission</p>
                </div>
              </div>
            </div>

            <div className="agenda-item agenda-block-header" data-aos="fade-up" data-aos-delay="500">
              <div className="agenda-time">
                12.55 PM
                <br />
                to
                <br />
                1.00 PM
              </div>
              <div className="agenda-content">
                <div className="agenda-dot"></div>
                <div className="agenda-body glass">
                  <h4>MORNING WRAP &amp; LUNCH ANNOUNCEMENT</h4>
                </div>
              </div>
            </div>

            <div className="agenda-item" data-aos="fade-up" data-aos-delay="550">
              <div className="agenda-time">
                1.00 PM
                <br />
                to
                <br />
                2.00 PM
              </div>
              <div className="agenda-content">
                <div className="agenda-dot"></div>
                <div className="agenda-body glass">
                  <span className="agenda-type break">Lunch</span>
                  <h4>LUNCH BREAK - Networking Lunch</h4>
                </div>
              </div>
            </div>

            <div className="agenda-item" data-aos="fade-up" data-aos-delay="600">
              <div className="agenda-time">
                2.00 PM
                <br />
                to
                <br />
                2.15 PM
              </div>
              <div className="agenda-content">
                <div className="agenda-dot"></div>
                <div className="agenda-body glass">
                  <span className="agenda-type session">Session</span>
                  <h4>The Human Mind in the Age of AI - Post-Lunch Experience</h4>
                  <p>Re-energising shift from regulation to solutions</p>
                </div>
              </div>
            </div>

            <div className="agenda-item" data-aos="fade-up" data-aos-delay="650">
              <div className="agenda-time">
                2.15 PM
                <br />
                to
                <br />
                2.45 PM
              </div>
              <div className="agenda-content">
                <div className="agenda-dot"></div>
                <div className="agenda-body glass">
                  <span className="agenda-type keynote">Keynote 5</span>
                  <h4>Keynote 5: &quot;Building the Always-On Enterprise - A CISO's Perspective on Continuous Compliance&quot;</h4>
                  <p>SEBI-regulated, systemically critical practitioner voice</p>
                </div>
              </div>
            </div>

            <div className="agenda-item" data-aos="fade-up" data-aos-delay="700">
              <div className="agenda-time">
                2.45 PM
                <br />
                to
                <br />
                3.00 PM
              </div>
              <div className="agenda-content">
                <div className="agenda-dot"></div>
                <div className="agenda-body glass">
                  <span className="agenda-type session">Launch</span>
                  <h4>ComplyX Launch: Mirror | Wizard | GRACE</h4>
                  <p>Vision-led journey to brand announcement</p>
                </div>
              </div>
            </div>

            <div className="agenda-item" data-aos="fade-up" data-aos-delay="750">
              <div className="agenda-time">
                3.00 PM
                <br />
                to
                <br />
                3.45 PM
              </div>
              <div className="agenda-content">
                <div className="agenda-dot"></div>
                <div className="agenda-body glass">
                  <span className="agenda-type panel">Panel</span>
                  <h4>Panel 2: From Compliance Burden to Competitive Advantage - The AI-Enabled GRC Transformation</h4>
                </div>
              </div>
            </div>

            <div className="agenda-item" data-aos="fade-up" data-aos-delay="800">
              <div className="agenda-time">
                3.45 PM
                <br />
                to
                <br />
                4.00 PM
              </div>
              <div className="agenda-content">
                <div className="agenda-dot"></div>
                <div className="agenda-body glass">
                  <span className="agenda-type session">Launch</span>
                  <h4>White Paper Launch: India AI Governance &amp; Continuous Compliance Outlook 2026</h4>
                  <p>Signature photo moment for press coverage</p>
                </div>
              </div>
            </div>

            <div className="agenda-item" data-aos="fade-up" data-aos-delay="850">
              <div className="agenda-time">
                4.00 PM
                <br />
                to
                <br />
                4.30 PM
              </div>
              <div className="agenda-content">
                <div className="agenda-dot"></div>
                <div className="agenda-body glass">
                  <span className="agenda-type break">Networking</span>
                  <h4>HI-TEA &amp; NETWORKING</h4>
                </div>
              </div>
            </div>

            <div className="agenda-item" data-aos="fade-up" data-aos-delay="900">
              <div className="agenda-time">
                4.30 PM
                <br />
                to
                <br />
                4.55 PM
              </div>
              <div className="agenda-content">
                <div className="agenda-dot"></div>
                <div className="agenda-body glass">
                  <span className="agenda-type keynote">Keynote 6</span>
                  <h4>Keynote 6: Data Privacy in the Age of AI, What DPDPA 2023 Means for India's Digital Enterprises</h4>
                  <p>DPDPA privacy: consent, automation, fiduciary duties</p>
                </div>
              </div>
            </div>

            <div className="agenda-item" data-aos="fade-up" data-aos-delay="950">
              <div className="agenda-time">
                4.55 PM
                <br />
                to
                <br />
                5.10 PM
              </div>
              <div className="agenda-content">
                <div className="agenda-dot"></div>
                <div className="agenda-body glass">
                  <span className="agenda-type keynote">Closing</span>
                  <h4>Closing Address: What India's GRC Community Must Do Next</h4>
                  <p>Forward-looking call to industry action</p>
                </div>
              </div>
            </div>

            <div className="agenda-item" data-aos="fade-up" data-aos-delay="1000">
              <div className="agenda-time">
                5.10 PM
                <br />
                to
                <br />
                5.22 PM
              </div>
              <div className="agenda-content">
                <div className="agenda-dot"></div>
                <div className="agenda-body glass">
                  <span className="agenda-type val">Valedictory</span>
                  <h4>Valedictory Address</h4>
                  <p>Government close signals policy-led platform</p>
                </div>
              </div>
            </div>

            <div className="agenda-item" data-aos="fade-up" data-aos-delay="1050">
              <div className="agenda-time">
                5.22 PM
                <br />
                to
                <br />
                5.30 PM
              </div>
              <div className="agenda-content">
                <div className="agenda-dot"></div>
                <div className="agenda-body glass">
                  <span className="agenda-type val">Close</span>
                  <h4>Vote of Thanks &amp; Close</h4>
                  <p>GRC 2027 seeded, Ampcus final appearance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Speaker / Trainer Spotlight */}
      <section id="speakers" className="section speakers-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">Featured Spotlight</span>
            <h2 className="section-title">
              Conclave <span className="gradient-text">Spotlight</span>
            </h2>
            <p className="section-desc">Featuring elite national-level cybersecurity policy heads, enterprise leaders, and government heads.</p>
          </div>

          <div className="speaker-highlight-container" data-aos="zoom-in">
            <div className="speaker-spotlight-card glass">
              <div className="speaker-img-column">
                <div className="speaker-avatar-wrap">
                  {/* Decorative rotating chakra photo ring */}
                  <div className="speaker-chakra-ring"></div>
                  <div className="speaker-photo">
                    <i className="fas fa-user-shield"></i>
                  </div>
                </div>
                <a href="#" className="speaker-social-btn" aria-label="LinkedIn">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>

              <div className="speaker-info-column">
                <span className="speaker-role">National Policy Authorities</span>
                <h3>To Be Announced</h3>
                <span className="speaker-org">Ampcus Board &amp; National Regulators</span>
                <p className="speaker-bio">
                  The speaker panel comprises senior directors of information security from systemically critical enterprises,
                  officials from regulatory agencies (such as RBI and DSCI), threat research heads from national monitoring centers (such as CERT-In),
                  and strategic security architects from Ampcus Cyber.
                </p>
                <div className="speaker-tags">
                  <span className="speaker-tag">AI Governance</span>
                  <span className="speaker-tag">National Security</span>
                  <span className="speaker-tag">Regulatory Law</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. Key Themes Cloud Section */}
      <section className="section themes-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">Key Themes</span>
            <h2 className="section-title">
              Topics on the <span className="gradient-text">Radar</span>
            </h2>
          </div>

          <div className="themes-cloud" data-aos="fade-up" data-aos-delay="200">
            {themeTags.map((tag, i) => {
              const [c1, c2] = tagColors[i % tagColors.length];
              const sizeClass = i % 3 === 0 ? "large" : i % 3 === 1 ? "medium" : "";
              return (
                <span
                  key={tag}
                  className={`theme-tag ${sizeClass}`}
                  style={{
                    ["--tag-c1" as any]: c1,
                    ["--tag-c2" as any]: c2,
                  }}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* 13. Who Should Attend Section */}
      <section className="section audience-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">Target Audience</span>
            <h2 className="section-title">
              Built for the <span className="gradient-text">Best</span>
            </h2>
          </div>

          <div className="audience-grid">
            <div className="audience-card glass" data-aos="zoom-in" data-aos-delay="0" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
              <div className="audience-icon">
                <i className="fas fa-user-shield"></i>
              </div>
              <h4>CISO &amp; CSOs</h4>
            </div>
            <div className="audience-card glass" data-aos="zoom-in" data-aos-delay="60" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
              <div className="audience-icon">
                <i className="fas fa-balance-scale"></i>
              </div>
              <h4>Risk &amp; Compliance Leaders</h4>
            </div>
            <div className="audience-card glass" data-aos="zoom-in" data-aos-delay="120" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
              <div className="audience-icon">
                <i className="fas fa-sitemap"></i>
              </div>
              <h4>CIO &amp; CTOs</h4>
            </div>
            <div className="audience-card glass" data-aos="zoom-in" data-aos-delay="180" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
              <div className="audience-icon">
                <i className="fas fa-university"></i>
              </div>
              <h4>Regulators &amp; Government</h4>
            </div>
            <div className="audience-card glass" data-aos="zoom-in" data-aos-delay="240" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
              <div className="audience-icon">
                <i className="fas fa-building"></i>
              </div>
              <h4>BFSI &amp; Enterprise Leaders</h4>
            </div>
            <div className="audience-card glass" data-aos="zoom-in" data-aos-delay="300" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
              <div className="audience-icon">
                <i className="fas fa-rocket"></i>
              </div>
              <h4>Security Vendors &amp; Innovators</h4>
            </div>
          </div>
        </div>
      </section>

      {/* 14. Sponsors & Partners Section */}
      <section id="sponsors" className="section sponsors-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">Partners &amp; Sponsors</span>
            <h2 className="section-title">
              Backed by <span className="gradient-text">Industry Leaders</span>
            </h2>
          </div>

          <div className="sponsor-tier" data-aos="fade-up" data-aos-delay="100">
            <div className="tier-label">Gold Partners</div>
            <div className="sponsor-row">
              <div className="sponsor-slot">
                <span>Gold Sponsor</span>
                <small>Slots Available</small>
              </div>
              <div className="sponsor-slot">
                <span>Gold Sponsor</span>
                <small>Slots Available</small>
              </div>
              <div className="sponsor-slot">
                <span>Gold Sponsor</span>
                <small>Slots Available</small>
              </div>
            </div>
          </div>

          <div className="sponsor-tier" data-aos="fade-up" data-aos-delay="200">
            <div className="tier-label">Silver Partners</div>
            <div className="sponsor-row">
              <div className="sponsor-slot small">
                <span>Silver</span>
              </div>
              <div className="sponsor-slot small">
                <span>Silver</span>
              </div>
              <div className="sponsor-slot small">
                <span>Silver</span>
              </div>
              <div className="sponsor-slot small">
                <span>Silver</span>
              </div>
              <div className="sponsor-slot small">
                <span>Silver</span>
              </div>
            </div>
          </div>

          <div className="sponsor-cta" data-aos="fade-up" data-aos-delay="300">
            <div className="sponsor-cta-inner glass" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
              <h3>Become a Sponsor</h3>
              <p>Connect your brand with 500+ senior security leaders. Limited sponsorship packages available.</p>
              <a
                href="#register"
                className="btn btn-primary"
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticReset}
                onClick={(e) => {
                  e.preventDefault();
                  setModalOpen(true);
                }}
              >
                Download Sponsorship Deck
              </a>
              <a
                href="#register"
                className="btn btn-ghost"
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticReset}
                onClick={(e) => {
                  e.preventDefault();
                  setModalOpen(true);
                }}
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 15. Venue / Delhi Section */}
      <section id="venue" className="section venue-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">Venue</span>
            <h2 className="section-title">
              A World-Class <span className="gradient-text">Setting</span>
            </h2>
          </div>

          <div className="venue-grid">
            <div className="venue-info" data-aos="fade-right">
              <div className="venue-badge">
                <i className="fas fa-map-marker-alt"></i> Delhi, India
              </div>
              <h3>Venue: To Be Announced</h3>
              <p className="venue-desc">
                The exact venue will be announced shortly. Expect a grand, premium 5-star setting befitting a summit of
                this stature in the heart of Delhi, India's historic and political capital.
              </p>

              <div className="venue-details">
                <div className="venue-detail-item">
                  <i className="fas fa-calendar-check"></i>
                  <div>
                    <strong>Date</strong>
                    <span>Monday, 22nd June 2026 </span>
                  </div>
                </div>
                <div className="venue-detail-item">
                  <i className="fas fa-clock"></i>
                  <div>
                    <strong>Time</strong>
                    <span>8:30 AM to 6:30 PM IST</span>
                  </div>
                </div>
                <div className="venue-detail-item">
                  <i className="fas fa-city"></i>
                  <div>
                    <strong>City</strong>
                    <span>Delhi, India (NCR)</span>
                  </div>
                </div>
              </div>

              <div className="venue-actions">
                <a
                  href="#register"
                  className="btn btn-primary"
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticReset}
                  onClick={(e) => {
                    e.preventDefault();
                    setModalOpen(true);
                  }}
                >
                  Register for Directions
                </a>
              </div>
            </div>

            <div className="venue-visual" data-aos="fade-left" data-aos-delay="200">
              <div className="venue-map-placeholder">
                <div className="map-bg">
                  {/* Stylized custom Delhi skyline vector backdrop */}
                  <div className="monument-outline-wrap" style={{ width: "90%", height: "90%", opacity: 0.25 }}>
                    <svg viewBox="0 0 500 150" style={{ width: "100%", height: "100%", fill: "var(--brand-gold)" }}>
                      <rect x="20" y="80" width="30" height="70" opacity="0.4" />
                      <rect x="40" y="60" width="25" height="90" opacity="0.5" />
                      <path d="M90,150 L95,20 L102,20 L107,150 Z" opacity="0.8" />
                      <rect x="94" y="50" width="9" height="4" opacity="0.9" />
                      <rect x="93" y="90" width="11" height="4" opacity="0.9" />
                      <path d="M140,150 v-40 c0,-15 30,-15 30,0 v40 Z" opacity="0.4" />
                      <rect x="190" y="95" width="40" height="55" opacity="0.6" />
                      <rect x="220" y="70" width="25" height="80" opacity="0.5" />
                      <path d="M270,150 h50 v-5 h-5 v-15 h-5 v15 h-30 v-15 h-5 v15 h-5 Z" opacity="0.8" />
                      <path d="M275,130 h40 v-18 h-40 Z" opacity="0.8" />
                      <path d="M280,112 A10,10 0 0,1 310,112" fill="none" stroke="var(--brand-gold)" strokeWidth="6" opacity="0.8" />
                      <path d="M272,97 h46 v-4 h-46 Z" opacity="0.8" />
                      <path d="M276,93 h38 v-12 h-38 Z" opacity="0.8" />
                      <path d="M360,150 C365,120 375,110 390,95 C375,120 370,130 360,150 Z" opacity="0.5" />
                      <path d="M420,150 C415,120 405,110 390,95 C405,120 410,130 420,150 Z" opacity="0.5" />
                      <path d="M390,95 C392,110 398,120 405,150 C398,120 392,110 390,95 Z" opacity="0.6" />
                      <rect x="440" y="40" width="35" height="110" opacity="0.3" />
                      <polygon points="440,40 457,15 475,40" opacity="0.3" />
                    </svg>
                  </div>

                  <div className="map-grid"></div>
                  <div className="map-pin">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>Delhi, India</span>
                  </div>
                  <div className="map-rings">
                    <div className="ring r1"></div>
                    <div className="ring r2"></div>
                    <div className="ring r3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 16. FAQ Accordion Section */}
      <section className="section faq-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">Information Desk</span>
            <h2 className="section-title">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="section-desc">Find quick resolutions for delegate registrations, travel coordination, and certification queries.</p>
          </div>

          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${openFaq === index ? "open" : ""}`}
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                <button
                  type="button"
                  className="faq-trigger"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span>{faq.q}</span>
                  <span className="faq-icon-wrap">
                    <i className="fas fa-plus"></i>
                  </span>
                </button>
                <div className="faq-content">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 17. Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-brand">
                <Image
                  src="/images/logo-light.webp"
                  alt="GRC Asia Conclave"
                  className="footer-logo logo-dark-img"
                  width={200}
                  height={52}
                  loading="lazy"
                />
                <Image
                  src="/images/logo-dark.webp"
                  alt="GRC Asia Conclave"
                  className="footer-logo logo-light-img"
                  width={200}
                  height={52}
                  loading="lazy"
                />
                <p>
                  India's most prestigious executive GRC summit, brought to you by <strong>Ampcus Cyber</strong>.
                </p>
                <div className="footer-social">
                  <a href="#" aria-label="LinkedIn">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#" aria-label="Twitter">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" aria-label="Instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" aria-label="YouTube">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>

              <div className="footer-links-col">
                <h5>Quick Links</h5>
                <ul>
                  <li>
                    <a href="#about" onClick={(e) => handleScrollTo(e, "about")}>
                      Overview
                    </a>
                  </li>
                  <li>
                    <a href="#speakers" onClick={(e) => handleScrollTo(e, "speakers")}>
                      Speakers
                    </a>
                  </li>
                  <li>
                    <a href="#agenda" onClick={(e) => handleScrollTo(e, "agenda")}>
                      Agenda
                    </a>
                  </li>
                  <li>
                    <a href="#sponsors" onClick={(e) => handleScrollTo(e, "sponsors")}>
                      Sponsors
                    </a>
                  </li>
                  <li>
                    <a href="#venue" onClick={(e) => handleScrollTo(e, "venue")}>
                      Venue
                    </a>
                  </li>
                  <li>
                    <a
                      href="#register"
                      onClick={(e) => {
                        e.preventDefault();
                        setModalOpen(true);
                      }}
                    >
                      Register Now
                    </a>
                  </li>
                </ul>
              </div>

              <div className="footer-links-col">
                <h5>Get Involved</h5>
                <ul>
                  <li>
                    <a
                      href="#register"
                      onClick={(e) => {
                        e.preventDefault();
                        setModalOpen(true);
                      }}
                    >
                      Attend the Conclave
                    </a>
                  </li>
                  <li>
                    <a
                      href="#register"
                      onClick={(e) => {
                        e.preventDefault();
                        setModalOpen(true);
                      }}
                    >
                      Apply to Speak
                    </a>
                  </li>
                  <li>
                    <a href="#sponsors" onClick={(e) => handleScrollTo(e, "sponsors")}>
                      Become a Sponsor
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setModalOpen(true);
                      }}
                    >
                      Media Enquiries
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setModalOpen(true);
                      }}
                    >
                      General Enquiries
                    </a>
                  </li>
                </ul>
              </div>

              <div className="footer-newsletter">
                <h5>Stay Updated</h5>
                <p>Get the latest updates on speakers, agenda &amp; early-bird offers.</p>
                <form className="newsletter-form" id="newsletterForm" onSubmit={handleNewsletterSubmit}>
                  <input
                    type="email"
                    aria-label="Email address for newsletter"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    style={newsletterStatus === "success" ? { background: "#22c55e" } : undefined}
                  >
                    <i className={newsletterStatus === "success" ? "fas fa-check" : "fas fa-arrow-right"}></i>
                  </button>
                </form>
                <div className="footer-event-info">
                  <div className="fei-item">
                    <i className="fas fa-calendar-alt"></i>
                    <span>27 June 2026</span>
                  </div>
                  <div className="fei-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>Delhi, India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container">
            <div className="footer-bottom-inner">
              <p>
                &copy; 2026 GRC Asia Conclave – India. An <strong>Ampcus Cyber</strong> Event. All Rights Reserved.
              </p>
              <div className="footer-legal">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms &amp; Conditions</a>
                <a href="#">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      <button
        id="backToTop"
        className={`back-to-top ${scrolled ? "visible" : ""}`}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <i className="fas fa-chevron-up"></i>
      </button>

      {/* 18. The Enquiry Validation Modal */}
      <EnquiryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* 19. Dynamic loading of AOS script */}
      <Script
        src="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js"
        strategy="lazyOnload"
        onLoad={() => {
          if ((window as any).AOS) {
            (window as any).AOS.init({
              duration: 750,
              easing: "ease-out-cubic",
              once: true,
              offset: 70,
            });
          }
        }}
      />
    </>
  );
}
