"use client";
import React, { useState, useEffect, useRef } from "react";
import { AgendaSession } from "../../data/eventData";

interface AgendaTimelineProps {
  agenda: AgendaSession[];
}

export default function AgendaTimeline({ agenda }: AgendaTimelineProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track timeline vertical draw progress on scroll
  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate scroll entry/exit ratios
      const start = rect.top - viewportHeight * 0.4;
      const total = rect.height;
      const current = -start;
      
      const ratio = Math.max(0, Math.min(current / total, 1));
      setScrollProgress(ratio * 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <section id="agenda" className="section agenda-section">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <span className="section-tag">Programme</span>
          <h2 className="section-title">
            Event <span className="gradient-text">Agenda</span>
          </h2>
          <p className="section-desc">
            Explore our curated, power-packed sessions, elite panels, and high-tea network mingles.
          </p>
        </div>

        <div className="agenda-timeline-container" ref={containerRef}>
          {/* Vertical progress line */}
          <div className="agenda-timeline-line-base">
            <div
              className="agenda-timeline-line-active"
              style={{ height: `${scrollProgress}%` }}
            ></div>
          </div>

          <div className="agenda-timeline">
            {agenda.map((item, idx) => {
              // Custom type text formatting
              let badgeLabel = item.type.toUpperCase();
              let badgeClass = `agenda-type-${item.type}`;
              const isBlockHeader = item.title === "MORNING BLOCK" || item.title === "MORNING WRAP & LUNCH ANNOUNCEMENT";

              if (isBlockHeader) {
                return (
                  <div key={idx} className="agenda-item agenda-block-header" data-aos="fade-up">
                    <div className="agenda-time">{item.time}</div>
                    <div className="agenda-content">
                      <div className="agenda-dot-wrap">
                        <div className="agenda-dot block-dot"></div>
                      </div>
                      <div className="agenda-body glass block-body">
                        <h4>{item.title}</h4>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={idx} className="agenda-item" data-aos="fade-up" data-aos-delay={idx * 30}>
                  {/* Time label column */}
                  <div className="agenda-time">
                    {item.time.split(" to ").map((t, tIdx) => (
                      <React.Fragment key={tIdx}>
                        {tIdx > 0 && <span className="time-sep">to</span>}
                        {t}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Body details column */}
                  <div className="agenda-content">
                    {/* Glowing timeline node */}
                    <div className="agenda-dot-wrap">
                      <div className={`agenda-dot ${badgeClass}-dot`}></div>
                      <div className="agenda-dot-glow"></div>
                    </div>

                    <div
                      className={`agenda-body glass clickable-body ${
                        expandedIndex === idx ? "body-expanded" : ""
                      }`}
                      onClick={() => toggleExpand(idx)}
                    >
                      <div className="agenda-body-header">
                        <span className={`agenda-type ${badgeClass}`}>{badgeLabel}</span>
                        {item.desc && (
                          <span className="expand-indicator-icon">
                            <i className={`fas ${expandedIndex === idx ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
                          </span>
                        )}
                      </div>
                      <h4>{item.title}</h4>
                      
                      {item.desc && (
                        <div className="agenda-body-expand-pane">
                          <p>{item.desc}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
