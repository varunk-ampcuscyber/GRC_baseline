"use client";
import React from "react";
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

interface RegistrationCTAProps {
  date: string;
  city: string;
  onRegisterClick: () => void;
}

export default function RegistrationCTA({ date, city, onRegisterClick }: RegistrationCTAProps) {
  return (
    <section className="section cta-imm-section">
      {/* Saffron-green moving light trail vector backdrops */}
      <div className="cta-light-trails">
        <div className="cta-trail-saffron"></div>
        <div className="cta-trail-green"></div>
      </div>
      
      {/* Floating digital rangoli particles */}
      <div className="cta-particles">
        <div className="p-dot p1"></div>
        <div className="p-dot p2"></div>
        <div className="p-dot p3"></div>
      </div>

      <div className="container">
        <div className="cta-imm-card glass" data-aos="zoom-in">
          <div className="cta-imm-content">
            <span className="section-tag">Complimentary Invitation</span>
            <h2 className="cta-imm-title">
              Shape India's <span className="gradient-text">GRC Frontier</span>
            </h2>
            <p className="cta-imm-desc">
              Due to restricted high-level boardroom seating slots, complimentary passes are reserved exclusively
              for CISOs, enterprise policy directors, risk heads, and government delegates. 
              Submit your coordinate pass for immediate board verification.
            </p>

            <div className="cta-imm-meta">
              <div className="cta-meta-badge">
                <i className="fas fa-calendar-day"></i> {date}
              </div>
              <div className="cta-meta-badge">
                <i className="fas fa-map-marker-alt"></i> {city}, India
              </div>
            </div>

            <div className="cta-imm-actions">
              <button
                type="button"
                className="btn btn-primary btn-glow"
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticReset}
                onClick={onRegisterClick}
              >
                <span>Reserve Your Spot</span>
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            
            {/* Integrated countdown mini version */}
            <div className="cta-countdown-wrapper">
              <Countdown />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
