"use client";
import React from "react";

interface SpeakerInfo {
  role: string;
  name: string;
  org: string;
  bio: string;
  tags: string[];
}

interface SpeakerSpotlightProps {
  speaker: SpeakerInfo;
}

export default function SpeakerSpotlight({ speaker }: SpeakerSpotlightProps) {
  return (
    <section id="speakers" className="section speakers-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header" data-aos="fade-up">
          <span className="section-tag">Featured Spotlight</span>
          <h2 className="section-title">
            Conclave <span className="gradient-text">Spotlight</span>
          </h2>
          <p className="section-desc">
            Featuring elite national-level cybersecurity policy heads, enterprise leaders, and government authorities.
          </p>
        </div>

        {/* Cinematic theater arch spotlight layout */}
        <div className="speaker-highlight-container" data-aos="zoom-in">
          {/* Mughal Arch SVG Background Outline */}
          <div className="speaker-spotlight-arch-bg">
            <svg viewBox="0 0 500 600" className="spotlight-arch-svg">
              <path
                d="M50,600 V250 C50,120 120,50 250,50 C380,50 450,120 450,250 V600"
                fill="none"
                stroke="var(--brand-gold)"
                strokeWidth="1"
                opacity="0.15"
              />
              <path
                d="M70,600 V250 C70,140 140,70 250,70 C360,70 430,140 430,250 V600"
                fill="none"
                stroke="var(--brand-gold)"
                strokeWidth="0.5"
                opacity="0.1"
              />
            </svg>
          </div>

          <div className="speaker-spotlight-card glass">
            {/* Left Avatar Column */}
            <div className="speaker-img-column">
              <div className="speaker-avatar-wrap">
                {/* Decorative rotating Ashoka Chakra golden ring */}
                <div className="speaker-chakra-ring">
                  <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", stroke: "var(--brand-gold)", fill: "none", strokeWidth: 0.6 }}>
                    <circle cx="50" cy="50" r="46" />
                    <circle cx="50" cy="50" r="41" strokeDasharray="1,2" />
                    {Array.from({ length: 24 }).map((_, spokeIdx) => (
                      <line
                        key={spokeIdx}
                        x1="50"
                        y1="50"
                        x2={50 + 46 * Math.cos((spokeIdx * 15 * Math.PI) / 180)}
                        y2={50 + 46 * Math.sin((spokeIdx * 15 * Math.PI) / 180)}
                      />
                    ))}
                  </svg>
                </div>
                
                {/* User avatar placeholder */}
                <div className="speaker-photo">
                  <i className="fas fa-user-shield"></i>
                </div>
              </div>

              {/* LinkedIn magnetic social hook */}
              <a href="#" className="speaker-social-btn" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>

            {/* Right Information Details Column */}
            <div className="speaker-info-column">
              <span className="speaker-role">{speaker.role}</span>
              <h3>{speaker.name}</h3>
              <span className="speaker-org">{speaker.org}</span>
              <p className="speaker-bio">{speaker.bio}</p>
              
              <div className="speaker-tags">
                {speaker.tags.map((tag) => (
                  <span key={tag} className="speaker-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
