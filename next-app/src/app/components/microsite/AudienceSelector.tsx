"use client";
import React, { useState } from "react";
import { AudienceItem } from "../../data/eventData";

// 3D Card Tilt handlers
const handleCardTilt = (e: React.MouseEvent<HTMLDivElement>) => {
  if (typeof window !== "undefined" && window.innerWidth < 768) return;
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = (e.clientX - cx) / (rect.width / 2);
  const dy = (e.clientY - cy) / (rect.height / 2);
  const tiltX = dy * -8;
  const tiltY = dx * 8;
  card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
  card.style.transition = "transform 0.1s ease";
};

const handleCardReset = (e: React.MouseEvent<HTMLDivElement>) => {
  const card = e.currentTarget;
  card.style.transform = "";
  card.style.transition = "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)";
};

interface AudienceSelectorProps {
  audience: AudienceItem[];
}

export default function AudienceSelector({ audience }: AudienceSelectorProps) {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  return (
    <section className="section audience-selector-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header" data-aos="fade-up">
          <span className="section-tag">Target Audience</span>
          <h2 className="section-title">
            Built for the <span className="gradient-text">Best</span>
          </h2>
          <p className="section-desc">
            An elite gathering tailored for C-suite governance, risk policy makers, and threat architects.
          </p>
        </div>

        {/* Tab Selection Layout Grid */}
        <div className="audience-interactive-layout">
          {/* Segment Selector grid */}
          <div className="audience-tabs-grid" data-aos="fade-right">
            {audience.map((item, idx) => {
              const isActive = selectedIdx === idx;
              return (
                <div
                  key={idx}
                  className={`audience-tab-card glass ${isActive ? "active-tab-glow" : ""}`}
                  onClick={() => setSelectedIdx(idx)}
                  onMouseMove={handleCardTilt}
                  onMouseLeave={handleCardReset}
                >
                  <div className="tab-card-icon-wrap">
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <h4>{item.role}</h4>
                  
                  {/* Subtle active indicators */}
                  {isActive && <div className="tab-card-active-dot"></div>}
                </div>
              );
            })}
          </div>

          {/* Staggered text description block panel */}
          <div className="audience-value-display-panel" data-aos="fade-left" data-aos-delay="150">
            <div className="value-panel-glass glass">
              {/* Rotating geometric Ashoka Chakra watermark background */}
              <div className="value-panel-watermark">
                <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", stroke: "var(--brand-gold)", fill: "none", strokeWidth: 0.4 }}>
                  <circle cx="50" cy="50" r="44" />
                  {Array.from({ length: 24 }).map((_, spokeIdx) => (
                    <line
                      key={spokeIdx}
                      x1="50"
                      y1="50"
                      x2={50 + 44 * Math.cos((spokeIdx * 15 * Math.PI) / 180)}
                      y2={50 + 44 * Math.sin((spokeIdx * 15 * Math.PI) / 180)}
                    />
                  ))}
                </svg>
              </div>

              <div className="value-panel-header">
                <i className={`fas ${audience[selectedIdx].icon}`}></i>
                <h3>Value Blueprint for {audience[selectedIdx].role}</h3>
              </div>
              <p className="value-panel-statement">{audience[selectedIdx].valueStatement}</p>
              
              <div className="value-panel-action-bullet">
                <span className="bullet-saffron"></span>
                <span>Automate compliance structures under DPDPA boundaries</span>
              </div>
              <div className="value-panel-action-bullet">
                <span className="bullet-green"></span>
                <span>Mitigate vendor vulnerability paths in real-time</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
