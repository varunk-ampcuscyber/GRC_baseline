"use client";
import React from "react";

interface OverviewProps {
  title: string;
  themeTags: string[];
}

export default function Overview({ title, themeTags }: OverviewProps) {
  // Staggered tag colors for keywords
  const tagColors = [
    ["rgba(255, 153, 51, 1)", "rgba(212, 175, 55, 1)"], // Saffron to gold
    ["rgba(212, 175, 55, 1)", "rgba(19, 136, 8, 1)"],   // Gold to green
    ["rgba(255, 255, 255, 1)", "rgba(255, 153, 51, 1)"], // White to saffron
    ["rgba(255, 153, 51, 1)", "rgba(19, 136, 8, 1)"],   // Saffron to green
    ["rgba(212, 175, 55, 1)", "rgba(255, 255, 255, 1)"], // Gold to white
  ];

  return (
    <section id="about" className="section about-section">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <span className="section-tag">Overview</span>
          <h2 className="section-title">
            Architecting India's <span className="gradient-text">Digital Defense</span>
          </h2>
          <p className="section-desc">
            A landmark summit shaping the future of cybersecurity and GRC leadership in Asia.
          </p>
        </div>

        <div className="about-grid">
          {/* Left Text Block */}
          <div className="about-text" data-aos="fade-right">
            <p className="about-lead">
              The <strong>{title}</strong> is an exclusive, invitation-only event for Governance, Risk &amp; Compliance
              professionals hosted by Ampcus Cyber. Held in the national capital of India, Delhi, this one-day
              power-packed summit aimed to boost the <span className="highlight-gold">India AI Mission &amp; Strengthen National Cybersecurity Strategy</span>.
            </p>
            <p className="about-body">
              The event intends to assemble those who matter most when it comes to India's digital safety such as senior
              government officials, regulators, law enforcement leaders, and enterprise cybersecurity experts.
            </p>
            <p className="about-body">
              The event brings out boardroom-level policy discussions, national conversations, and strategic decisions
              focused to lead the real-world outcomes. The purpose of the GRC Asia Conclave is to bring together the
              leaders who make the policies &amp; standards to defend against threats.
            </p>
          </div>

          {/* Right Visual Block with Lotus Temple curve art */}
          <div className="about-visual" data-aos="fade-left" data-aos-delay="200">
            <div className="monument-outline-wrap">
              <svg
                viewBox="0 0 100 80"
                style={{ width: "240px", height: "240px", stroke: "var(--brand-gold)", fill: "none", strokeWidth: 0.8 }}
              >
                {/* Outermost petals */}
                <path d="M50,15 C55,35 65,45 80,65 C60,65 55,55 50,45 C45,55 40,65 20,65 C35,45 45,35 50,15 Z" />
                {/* Mid petals */}
                <path d="M50,30 C58,45 70,55 88,70 C70,70 60,60 50,52 C40,60 30,70 12,70 C30,55 42,45 50,30 Z" />
                {/* Inner petals */}
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

        {/* Interactive Radar Tag Cloud */}
        <div className="overview-themes-wrap" data-aos="fade-up">
          <div className="section-header" style={{ marginTop: "4rem", marginBottom: "2rem" }}>
            <span className="section-tag">Key Themes</span>
            <h3 className="section-title-small">Topics on the <span className="gradient-text">Radar</span></h3>
          </div>
          <div className="themes-cloud">
            {themeTags.map((tag, idx) => {
              const [c1, c2] = tagColors[idx % tagColors.length];
              const sizeClass = idx % 3 === 0 ? "large" : idx % 3 === 1 ? "medium" : "";
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
      </div>
    </section>
  );
}
