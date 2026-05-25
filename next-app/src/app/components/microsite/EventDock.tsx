"use client";
import React from "react";

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

interface EventDockProps {
  date: string;
  time: string;
  duration: string;
  venue: string;
  city: string;
  country: string;
  speaker: string;
  format: string;
  status: string;
}

export default function EventDock({
  date,
  time,
  duration,
  venue,
  city,
  country,
  speaker,
  format,
  status,
}: EventDockProps) {
  const coordinates = [
    { label: "Date", value: date, desc: "Monday Session", icon: "fa-calendar-alt" },
    { label: "Time", value: time, desc: "Indian Standard Time", icon: "fa-clock" },
    { label: "Duration", value: duration, desc: "Power-Packed Day", icon: "fa-hourglass-half" },
    { label: "Venue", value: venue, desc: "Announcing Shortly", icon: "fa-hotel" },
    { label: "Location", value: `${city}, ${country}`, desc: "Capital Region", icon: "fa-city" },
    { label: "Presenter", value: speaker, desc: "Top GRC Architects", icon: "fa-user-tie" },
    { label: "Format", value: format, desc: "VIP Networking", icon: "fa-network-wired" },
    { label: "Status", value: status, desc: "Limited SLots Available", icon: "fa-info-circle" },
  ];

  return (
    <section className="section event-dock-section">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <span className="section-tag">Conclave Metrics</span>
          <h2 className="section-title">
            Event <span className="gradient-text">Coordinates</span>
          </h2>
          <p className="section-desc">
            Instantly view chronological coordinates, registration slots, and layout structures.
          </p>
        </div>

        <div className="event-details-grid">
          {coordinates.map((item, idx) => (
            <div
              key={idx}
              className="detail-card glass"
              onMouseMove={handleCardTilt}
              onMouseLeave={handleCardReset}
              data-aos="zoom-in"
              data-aos-delay={idx * 50}
            >
              <div className="card-icon">
                <i className={`fas ${item.icon}`}></i>
              </div>
              <h3>{item.label}</h3>
              <p>{item.value}</p>
              <small>{item.desc}</small>

              {/* High-fidelity Ashoka Chakra watermark background vector */}
              <svg
                viewBox="0 0 100 100"
                className="card-watermark"
                style={{ stroke: "var(--brand-gold)", fill: "none", strokeWidth: 0.6 }}
              >
                <circle cx="50" cy="50" r="42" />
                <circle cx="50" cy="50" r="8" strokeWidth="1" />
                {Array.from({ length: 24 }).map((_, spokeIdx) => (
                  <line
                    key={spokeIdx}
                    x1="50"
                    y1="50"
                    x2={50 + 40 * Math.cos((spokeIdx * 15 * Math.PI) / 180)}
                    y2={50 + 40 * Math.sin((spokeIdx * 15 * Math.PI) / 180)}
                  />
                ))}
              </svg>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
