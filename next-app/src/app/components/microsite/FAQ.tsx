"use client";
import React, { useState } from "react";
import { FAQItem } from "../../data/eventData";

interface FAQProps {
  faqs: FAQItem[];
}

export default function FAQ({ faqs }: FAQProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <section className="section faq-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header" data-aos="fade-up">
          <span className="section-tag">Information Desk</span>
          <h2 className="section-title">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="section-desc">
            Find quick resolutions for delegate registrations, travel coordination, and CPE certification queries.
          </p>
        </div>

        {/* Accordions Container */}
        <div className="faq-container">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className={`faq-item ${isOpen ? "open" : ""}`}
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                <button
                  type="button"
                  className="faq-trigger"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <span className="faq-icon-wrap">
                    <i className={`fas ${isOpen ? "fa-minus" : "fa-plus"}`}></i>
                  </span>
                </button>
                <div className="faq-content">
                  <p>{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
