"use client";
import React from "react";
import { BenefitCard } from "../../data/eventData";

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
  card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
  card.style.transition = "transform 0.1s ease";
};

const handleCardReset = (e: React.MouseEvent<HTMLDivElement>) => {
  const card = e.currentTarget;
  card.style.transform = "";
  card.style.transition = "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)";
};

interface WhyAttendProps {
  benefits: BenefitCard[];
}

export default function WhyAttend({ benefits }: WhyAttendProps) {
  return (
    <section id="why-attend" className="section why-section">
      {/* Dynamic glowing background grid overlays */}
      <div className="why-bg-pattern"></div>
      
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <span className="section-tag">Value Proposition</span>
          <h2 className="section-title">
            An Unmissable <span className="gradient-text">Experience</span>
          </h2>
          <p className="section-desc">
            Interact with boardroom policy dialogues and gain continuous assurance tools.
          </p>
        </div>

        <div className="why-grid">
          {benefits.map((item, idx) => {
            // Apply corresponding card themes
            let borderClass = "border-saffron-glow";
            if (item.type === "green") borderClass = "border-green-glow";
            if (item.type === "gold") borderClass = "border-gold-glow";

            return (
              <div
                key={idx}
                className={`why-card glass ${borderClass}`}
                data-aos="fade-up"
                data-aos-delay={idx * 100}
                data-num={`0${idx + 1}`}
                onMouseMove={handleCardTilt}
                onMouseLeave={handleCardReset}
              >
                <div className="why-icon">
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                
                {/* Floating range spark overlays */}
                <div className="why-card-glow-dot"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
