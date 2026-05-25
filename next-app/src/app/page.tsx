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
    ["rgba(124,58,237,1)", "rgba(236,72,153,1)"],
    ["rgba(236,72,153,1)", "rgba(249,115,22,1)"],
    ["rgba(6,182,212,1)", "rgba(124,58,237,1)"],
    ["rgba(249,115,22,1)", "rgba(245,158,11,1)"],
    ["rgba(124,58,237,1)", "rgba(6,182,212,1)"],
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
                About
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

      {/* 4. Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-bg-grid"></div>
        <div className="hero-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
          <div className="orb orb-4"></div>
        </div>
        <div className="hero-ring hero-ring-1"></div>
        <div className="hero-ring hero-ring-2"></div>
        <div className="hero-ring hero-ring-3"></div>

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
            <span className="gradient-text">Asia's Premier</span>
            <br />
            GRC &amp; Cybersecurity
            <br />
            <span className="outline-text">Summit</span>
          </h1>

          <div className="hero-badge" data-aos="fade-down" data-aos-delay="200">
            <span className="badge-dot"></span>
            <span>Mumbai • 27 June 2026</span>
          </div>

          <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="500">
            Where regulators, risk leaders, and AI innovators converge to shape the future of governance, risk &amp;
            compliance for continuous assurance &amp; digital trust.
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
              <span>Secure Your Seat</span>
              <i className="fas fa-arrow-right"></i>
            </a>
            <a
              href="#about"
              className="btn btn-ghost"
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticReset}
              onClick={(e) => handleScrollTo(e, "about")}
            >
              <span>Explore Event</span>
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

      {/* 5. Stats Section (Uncommented for Premium Visual Impact) */}
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

      {/* 6. About Section */}
      <section id="about" className="section about-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">About The Event</span>
            <h2 className="section-title">
              Architecting India's <span className="gradient-text">Digital Defense</span>
            </h2>
            <p className="section-desc">A landmark summit shaping the future of cybersecurity and GRC leadership in Asia.</p>
          </div>

          <div className="about-grid">
            <div className="about-text" data-aos="fade-right">
              <p className="about-lead">
                The GRC Asia Conclave - India is an exclusive, invitation-only event for Governance, Risk &amp; Compliance
                professionals hosted by Ampcus Cyber. Held in the financial capital of India, Mumbai, this one-day
                power-packed summit aimed to boost the India AI Mission &amp; Strengthen National Cybersecurity Strategy. The
                event intends to assemble those who matter most when it comes to India's digital safety such as senior
                government officials, regulators, law enforcement leaders, and cybersecurity experts.
              </p>
              <p>
                The event brings out boardroom-level policy discussions, national conversations, and strategic decisions
                focused to lead the real-world outcomes. The purpose of the GRC Asia Conclave is to bring together the
                leaders who make the policies &amp; standards to defend against threats.
              </p>
            </div>

            <div className="about-visual" data-aos="fade-left" data-aos-delay="200">
              <div className="about-card-stack">
                <div className="acard acard-1" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
                  <i className="fas fa-globe-asia"></i>
                  <h4>Asia-Pacific Focus</h4>
                  <p>Regional threat intelligence, local compliance dynamics, and cross-border security strategy.</p>
                </div>
                <div className="acard acard-2" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
                  <i className="fas fa-network-wired"></i>
                  <h4>C-Suite Networking</h4>
                  <p>Exclusive boardroom-style roundtables and high-value networking with top decision-makers.</p>
                </div>
                <div className="acard acard-3" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
                  <i className="fas fa-lightbulb"></i>
                  <h4>Innovation Showcase</h4>
                  <p>Live demos and exhibitions from the world's leading cybersecurity &amp; GRC technology providers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Why Attend Section */}
      <section id="why-attend" className="section why-section">
        <div className="why-bg-pattern"></div>
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">Why Attend</span>
            <h2 className="section-title">
              An Unmissable <span className="gradient-text">Experience</span>
            </h2>
          </div>

          <div className="why-grid">
            <div className="why-card" data-aos="fade-up" data-aos-delay="0" data-num="01" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
              <div className="why-icon">
                <i className="fas fa-user-shield"></i>
              </div>
              <h3>Top-Tier Speakers</h3>
              <p>
                India's most senior CISOs, policy-makers, regulatory heads, and cybersecurity architects sharing the
                insights, strategies, and foresight.
              </p>
            </div>
            <div className="why-card" data-aos="fade-up" data-aos-delay="100" data-num="02" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
              <div className="why-icon">
                <i className="fas fa-network-wired"></i>
              </div>
              <h3>Strategic Networking</h3>
              <p>
                Policymakers, CISOs, regulators, law enforcement leaders, and enterprise security heads, all in one space.
                The partnerships forged here shape how India defends itself for years to come.
              </p>
            </div>
            <div className="why-card" data-aos="fade-up" data-aos-delay="200" data-num="03" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
              <div className="why-icon">
                <i className="fas fa-brain"></i>
              </div>
              <h3>Intelligence You Can Act On</h3>
              <p>
                National-level frameworks, battle-tested strategies, and frontline threat intelligence, delivered by the
                people who built them &amp; designed for leaders who need to implement them tomorrow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Speakers Section */}
      <section id="speakers" className="section speakers-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">Speakers &amp; Leaders</span>
            <h2 className="section-title">
              The Minds Behind <span className="gradient-text">India's</span> Cyber Defense
            </h2>
          </div>

          {/* Classified Roster Banner */}
          <div className="coming-soon-banner" data-aos="zoom-in" data-aos-delay="100">
            <div className="cs-scanline"></div>
            <div className="cs-content">
              <i className="fas fa-fingerprint"></i>
              <h3>Classified Roster</h3>
              <p>Full speaker line-up is currently classified. Decrypting soon...</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Agenda / Schedule Section */}
      <section id="agenda" className="section agenda-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">Programme</span>
            <h2 className="section-title">
              Event <span className="gradient-text">Agenda</span>
            </h2>
          </div>

          <div className="agenda-timeline">
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
                <div className="agenda-body">
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
                <div className="agenda-body">
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
                <div className="agenda-body">
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
                <div className="agenda-body">
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
                <div className="agenda-body">
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
                <div className="agenda-body">
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
                <div className="agenda-body">
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
                <div className="agenda-body">
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
                <div className="agenda-body">
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
                <div className="agenda-body">
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
                <div className="agenda-body">
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
                <div className="agenda-body">
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
                <div className="agenda-body">
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
                <div className="agenda-body">
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
                <div className="agenda-body">
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
                <div className="agenda-body">
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
                <div className="agenda-body">
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
                <div className="agenda-body">
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
                <div className="agenda-body">
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
                <div className="agenda-body">
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
                <div className="agenda-body">
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
                <div className="agenda-body">
                  <span className="agenda-type val">Close</span>
                  <h4>Vote of Thanks &amp; Close</h4>
                  <p>GRC 2027 seeded, Ampcus final appearance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Key Themes Cloud Section */}
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

      {/* 11. Who Should Attend Section */}
      <section className="section audience-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <span className="section-tag">Who Attends</span>
            <h2 className="section-title">
              Built for the <span className="gradient-text">Best</span>
            </h2>
          </div>

          <div className="audience-grid">
            <div className="audience-card" data-aos="zoom-in" data-aos-delay="0" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
              <div className="audience-icon">
                <i className="fas fa-user-shield"></i>
              </div>
              <h4>CISO &amp; CSOs</h4>
            </div>
            <div className="audience-card" data-aos="zoom-in" data-aos-delay="60" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
              <div className="audience-icon">
                <i className="fas fa-balance-scale"></i>
              </div>
              <h4>Risk &amp; Compliance Leaders</h4>
            </div>
            <div className="audience-card" data-aos="zoom-in" data-aos-delay="120" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
              <div className="audience-icon">
                <i className="fas fa-sitemap"></i>
              </div>
              <h4>CIO &amp; CTOs</h4>
            </div>
            <div className="audience-card" data-aos="zoom-in" data-aos-delay="180" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
              <div className="audience-icon">
                <i className="fas fa-university"></i>
              </div>
              <h4>Regulators &amp; Government</h4>
            </div>
            <div className="audience-card" data-aos="zoom-in" data-aos-delay="240" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
              <div className="audience-icon">
                <i className="fas fa-building"></i>
              </div>
              <h4>BFSI &amp; Enterprise Leaders</h4>
            </div>
            <div className="audience-card" data-aos="zoom-in" data-aos-delay="300" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
              <div className="audience-icon">
                <i className="fas fa-rocket"></i>
              </div>
              <h4>Security Vendors &amp; Innovators</h4>
            </div>
          </div>
        </div>
      </section>

      {/* 12. Sponsors & Partners Section */}
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
            <div className="sponsor-cta-inner" onMouseMove={handleCardTilt} onMouseLeave={handleCardReset}>
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

      {/* 13. Venue Section */}
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
                <i className="fas fa-map-marker-alt"></i> Mumbai, India
              </div>
              <h3>Venue: To Be Announced</h3>
              <p className="venue-desc">
                The exact venue will be announced shortly. Expect a grand, premium 5-star setting befitting a summit of
                this stature in the heart of Mumbai, India's financial capital.
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
                    <span>Mumbai, Maharashtra, India</span>
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
                  <div className="map-grid"></div>
                  <div className="map-pin">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>Mumbai, India</span>
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

      {/* 14. Footer */}
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
                  Asia's most prestigious GRC &amp; Cybersecurity summit, brought to you by{" "}
                  <strong>Ampcus Cyber</strong>.
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
                      About the Event
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
                      Register
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
                    <span>Mumbai, India</span>
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

      {/* 15. The Enquiry Validation Modal */}
      <EnquiryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* 16. Dynamic loading of AOS script */}
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
