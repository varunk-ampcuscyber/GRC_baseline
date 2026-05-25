"use client";
import React, { useState } from "react";
import { TakeawayItem } from "../../data/eventData";

interface TakeawayOrbitProps {
  takeaways: TakeawayItem[];
}

export default function TakeawayOrbit({ takeaways }: TakeawayOrbitProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Position coordinates for 4 items in a radial pattern on desktop (relative % coordinates)
  const orbitPositions = [
    { top: "5%", left: "5%" },    // Top-Left
    { top: "5%", right: "5%" },   // Top-Right
    { bottom: "5%", left: "5%" }, // Bottom-Left
    { bottom: "5%", right: "5%" },// Bottom-Right
  ];

  return (
    <section className="section takeaway-orbit-section">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <span className="section-tag">Key Takeaways</span>
          <h2 className="section-title">
            What You Will <span className="gradient-text">Gain</span>
          </h2>
          <p className="section-desc">
            Unlock advanced strategic compliance tools and frameworks through focused, expert-led breakouts.
          </p>
        </div>

        {/* Outer orbital wrapper */}
        <div className="orbit-nexus-container" data-aos="zoom-in">
          {/* Animated background network lines (only visible on desktop) */}
          <div className="orbit-network-svg-wrap">
            <svg viewBox="0 0 800 600" className="orbit-svg-canvas">
              {/* Connecting line 0 (Center to Top-Left) */}
              <line
                x1="400"
                y1="300"
                x2="150"
                y2="100"
                className={`orbit-connection-path ${hoveredIdx === 0 ? "active" : ""}`}
              />
              {/* Connecting line 1 (Center to Top-Right) */}
              <line
                x1="400"
                y1="300"
                x2="650"
                y2="100"
                className={`orbit-connection-path ${hoveredIdx === 1 ? "active" : ""}`}
              />
              {/* Connecting line 2 (Center to Bottom-Left) */}
              <line
                x1="400"
                y1="300"
                x2="150"
                y2="500"
                className={`orbit-connection-path ${hoveredIdx === 2 ? "active" : ""}`}
              />
              {/* Connecting line 3 (Center to Bottom-Right) */}
              <line
                x1="400"
                y1="300"
                x2="650"
                y2="500"
                className={`orbit-connection-path ${hoveredIdx === 3 ? "active" : ""}`}
              />

              {/* Pulsing indicator dots */}
              <circle cx="400" cy="300" r="12" fill="rgba(212,175,55,0.2)" className="pulse-circle" />
            </svg>
          </div>

          {/* Central Reactor Block */}
          <div className="orbit-center-reactor">
            <div className="reactor-pulse-bg"></div>
            <div className="reactor-chakra-wrap">
              {/* Ashoka Chakra-inspired rotating ring */}
              <svg viewBox="0 0 100 100" className="spinning-reactor-chakra">
                <circle cx="50" cy="50" r="45" stroke="var(--brand-gold)" strokeWidth="1" fill="none" />
                <circle cx="50" cy="50" r="8" stroke="var(--brand-gold)" strokeWidth="1.5" fill="none" />
                {Array.from({ length: 24 }).map((_, spokeIdx) => (
                  <line
                    key={spokeIdx}
                    x1="50"
                    y1="50"
                    x2={50 + 38 * Math.cos((spokeIdx * 15 * Math.PI) / 180)}
                    y2={50 + 38 * Math.sin((spokeIdx * 15 * Math.PI) / 180)}
                    stroke="var(--brand-gold)"
                    strokeWidth="0.8"
                  />
                ))}
              </svg>
            </div>
            <div className="reactor-text">
              <span>What You'll</span>
              <strong>GAIN</strong>
            </div>
          </div>

          {/* Orbiting Takeaway Cards */}
          <div className="orbit-cards-container">
            {takeaways.map((item, idx) => {
              const posStyle = orbitPositions[idx % orbitPositions.length];
              return (
                <div
                  key={idx}
                  className={`takeaway-card glass orbit-node orbit-node-${idx} ${
                    hoveredIdx === idx ? "node-focused" : ""
                  }`}
                  style={posStyle as React.CSSProperties}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                >
                  <div className="takeaway-num-badge">0{idx + 1}</div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                  
                  {/* Subtle vector corner brackets */}
                  <div className="takeaway-corner tl"></div>
                  <div className="takeaway-corner tr"></div>
                  <div className="takeaway-corner bl"></div>
                  <div className="takeaway-corner br"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
