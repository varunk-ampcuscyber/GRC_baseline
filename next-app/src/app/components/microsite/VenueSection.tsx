"use client";
import React from "react";

interface VenueSectionProps {
  venue: string;
  date: string;
  time: string;
  city: string;
  country: string;
  onRegisterClick: () => void;
}

export default function VenueSection({
  venue,
  date,
  time,
  city,
  country,
  onRegisterClick,
}: VenueSectionProps) {
  return (
    <section id="venue" className="section venue-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header" data-aos="fade-up">
          <span className="section-tag">Venue</span>
          <h2 className="section-title">
            A World-Class <span className="gradient-text">Setting</span>
          </h2>
          <p className="section-desc">
            Assemble in the historic heart of the capital city for cross-enterprise GRC policy development.
          </p>
        </div>

        {/* Large venue pass container block */}
        <div className="venue-grid">
          {/* Left Text Block */}
          <div className="venue-info" data-aos="fade-right">
            <div className="venue-badge">
              <i className="fas fa-map-marker-alt"></i> {city}, {country}
            </div>
            <h3>Venue: {venue}</h3>
            <p className="venue-desc">
              The exact venue will be announced shortly. Expect a grand, premium 5-star setting befitting a summit of
              this stature in the heart of Delhi, India's historic and political capital.
            </p>

            <div className="venue-details">
              <div className="venue-detail-item">
                <i className="fas fa-calendar-check"></i>
                <div>
                  <strong>Date</strong>
                  <span>{date}</span>
                </div>
              </div>
              <div className="venue-detail-item">
                <i className="fas fa-clock"></i>
                <div>
                  <strong>Time</strong>
                  <span>{time} IST</span>
                </div>
              </div>
              <div className="venue-detail-item">
                <i className="fas fa-city"></i>
                <div>
                  <strong>City</strong>
                  <span>{city}, {country} (NCR)</span>
                </div>
              </div>
            </div>

            <div className="venue-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={onRegisterClick}
              >
                Register for Directions
              </button>
            </div>
          </div>

          {/* Right Visual Map with layered Delhi Skyline backdrop */}
          <div className="venue-visual" data-aos="fade-left" data-aos-delay="200">
            <div className="venue-map-placeholder">
              <div className="map-bg">
                {/* Layered high-fidelity custom Delhi skyline SVG */}
                <div className="monument-outline-wrap" style={{ width: "95%", height: "95%", opacity: 0.2 }}>
                  <svg viewBox="0 0 500 150" style={{ width: "100%", height: "100%", fill: "var(--brand-gold)" }}>
                    {/* Columns and skyscrapers */}
                    <rect x="20" y="80" width="30" height="70" opacity="0.4" />
                    <rect x="40" y="60" width="25" height="90" opacity="0.5" />
                    {/* Qutub Minar Silhouette */}
                    <path d="M90,150 L95,20 L102,20 L107,150 Z" opacity="0.8" />
                    <rect x="94" y="50" width="9" height="4" opacity="0.9" />
                    <rect x="93" y="90" width="11" height="4" opacity="0.9" />
                    {/* Dome of Rashtrapati Bhavan */}
                    <path d="M140,150 v-40 c0,-15 30,-15 30,0 v40 Z" opacity="0.4" />
                    {/* India Gate Silhouette */}
                    <path d="M270,150 h50 v-5 h-5 v-15 h-5 v15 h-30 v-15 h-5 v15 h-5 Z" opacity="0.8" />
                    <path d="M275,130 h40 v-18 h-40 Z" opacity="0.8" />
                    <path d="M280,112 A10,10 0 0,1 310,112" fill="none" stroke="var(--brand-gold)" strokeWidth="6" opacity="0.8" />
                    <path d="M272,97 h46 v-4 h-46 Z" opacity="0.8" />
                    <path d="M276,93 h38 v-12 h-38 Z" opacity="0.8" />
                    {/* Lotus Temple Outline petals */}
                    <path d="M360,150 C365,120 375,110 390,95 C375,120 370,130 360,150 Z" opacity="0.5" />
                    <path d="M420,150 C415,120 405,110 390,95 C405,120 410,130 420,150 Z" opacity="0.5" />
                    <path d="M390,95 C392,110 398,120 405,150 C398,120 392,110 390,95 Z" opacity="0.6" />
                    {/* Red Fort arches minarets */}
                    <rect x="440" y="40" width="35" height="110" opacity="0.3" />
                    <polygon points="440,40 457,15 475,40" opacity="0.3" />
                  </svg>
                </div>

                <div className="map-grid"></div>
                {/* Floating Map Pin */}
                <div className="map-pin">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>Delhi, India</span>
                </div>
                {/* Pulsating radar wave rings */}
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
  );
}
