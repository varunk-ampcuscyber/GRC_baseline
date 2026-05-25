"use client";
import React, { useState } from "react";
import Image from "next/image";

interface FooterProps {
  date: string;
  city: string;
}

export default function Footer({ date, city }: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "success">("idle");

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

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const navH = document.getElementById("navbar")?.offsetHeight || 94;
    window.scrollTo({
      top: target.offsetTop - navH,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer relative-footer">
      {/* Saffron-to-green tricolor top border bar */}
      <div className="footer-tricolor-top-bar"></div>

      {/* Skyline backdrop silhouette behind copyright base */}
      <div className="footer-skyline-wrap" style={{ opacity: 0.08 }}>
        <svg viewBox="0 0 500 80" style={{ width: "100%", height: "80px", fill: "var(--brand-gold)" }}>
          <rect x="10" y="50" width="20" height="30" />
          <rect x="40" y="30" width="15" height="50" />
          <path d="M70,80 L75,10 L80,10 L85,80 Z" />
          <path d="M120,80 v-25 c0,-8 15,-8 15,0 v25 Z" />
          <path d="M220,80 h30 v-3 h-3 v-10 h-3 v10 h-18 v-10 h-3 v10 h-3 Z" />
          <path d="M224,65 h22 v-10 h-22 Z" />
          <path d="M290,80 C293,60 300,50 310,40 C300,60 297,70 290,80 Z" />
          <path d="M330,80 C327,60 320,50 310,40 C320,60 323,70 330,80 Z" />
          <path d="M310,40 C312,50 315,60 320,80 C315,60 312,50 310,40 Z" />
          <rect x="360" y="25" width="20" height="55" />
          <polygon points="360,25 370,10 380,25" />
        </svg>
      </div>

      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            {/* Column 1 - Brand Info */}
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
                India's most prestigious executive GRC summit, proudly brought to you by <strong>Ampcus Cyber</strong>.
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

            {/* Column 2 - Main Links */}
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
              </ul>
            </div>

            {/* Column 3 - Actions */}
            <div className="footer-links-col">
              <h5>Get Involved</h5>
              <ul>
                <li>
                  <a href="#about" onClick={(e) => handleScrollTo(e, "about")}>
                    Attend the Conclave
                  </a>
                </li>
                <li>
                  <a href="#speakers" onClick={(e) => handleScrollTo(e, "speakers")}>
                    Apply to Speak
                  </a>
                </li>
                <li>
                  <a href="#sponsors" onClick={(e) => handleScrollTo(e, "sponsors")}>
                    Become a Partner
                  </a>
                </li>
                <li>
                  <a href="#about" onClick={(e) => handleScrollTo(e, "about")}>
                    Press Enquiries
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4 - Newsletter */}
            <div className="footer-newsletter">
              <h5>Stay Updated</h5>
              <p>Get the latest updates on speaker panels, GRC frameworks, and invitation passes.</p>
              <form className="newsletter-form" id="newsletterForm" onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  aria-label="Email address for newsletter"
                  placeholder="Enter your work email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  style={newsletterStatus === "success" ? { background: "#138808" } : undefined}
                >
                  <i className={newsletterStatus === "success" ? "fas fa-check" : "fas fa-arrow-right"}></i>
                </button>
              </form>
              <div className="footer-event-info">
                <div className="fei-item">
                  <i className="fas fa-calendar-alt"></i>
                  <span>{date}</span>
                </div>
                <div className="fei-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{city}, India</span>
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
              <a href="#">Cookie Guidelines</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
