"use client";
import React from "react";
import Image from "next/image";

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

interface HeaderProps {
  scrolled: boolean;
  activeSection: string;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  theme: string;
  toggleTheme: () => void;
  onRegisterClick: () => void;
}

export default function Header({
  scrolled,
  activeSection,
  menuOpen,
  setMenuOpen,
  theme,
  toggleTheme,
  onRegisterClick,
}: HeaderProps) {
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

  return (
    <nav id="navbar" className={`${scrolled ? "scrolled" : ""} glass-nav`}>
      {/* Bottom tricolor glow outline indicator */}
      <div className="nav-tricolor-line"></div>
      
      <div className="nav-container">
        <a href="#home" className="nav-logo" onClick={(e) => handleScrollTo(e, "home")}>
          <Image
            src="/images/logo-light.webp"
            alt="GRC Conclave"
            className="logo-dark-img"
            width={240}
            height={60}
            priority
          />
          <Image
            src="/images/logo-dark.webp"
            alt="GRC Conclave"
            className="logo-light-img"
            width={240}
            height={60}
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
          <li className="mobile-cta-only">
            <a
              href="#register"
              className="nav-link nav-cta-link"
              onClick={(e) => {
                e.preventDefault();
                onRegisterClick();
                setMenuOpen(false);
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

          {/* Desktop Only Magnetic CTA Button */}
          <button
            type="button"
            className="btn btn-primary nav-desktop-cta btn-glow"
            onMouseMove={handleMagneticMove}
            onMouseLeave={handleMagneticReset}
            onClick={onRegisterClick}
          >
            <span>Register Now</span>
            <i className="fas fa-arrow-right"></i>
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
  );
}
