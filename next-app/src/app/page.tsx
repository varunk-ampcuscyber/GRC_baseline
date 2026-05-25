"use client";
import React, { useState, useEffect } from "react";
import Script from "next/script";

// Structured Event Data
import { eventData } from "./data/eventData";

// Core Layout components
import Preloader from "./components/Preloader";
import ParticlesCanvas from "./components/ParticlesCanvas";
import CustomCursor from "./components/CustomCursor";
import EnquiryModal from "./components/EnquiryModal";

// Modular Microsite components
import Header from "./components/microsite/Header";
import Hero3D from "./components/microsite/Hero3D";
import EventDock from "./components/microsite/EventDock";
import Overview from "./components/microsite/Overview";
import WhyAttend from "./components/microsite/WhyAttend";
import TakeawayOrbit from "./components/microsite/TakeawayOrbit";
import AgendaTimeline from "./components/microsite/AgendaTimeline";
import SpeakerSpotlight from "./components/microsite/SpeakerSpotlight";
import AudienceSelector from "./components/microsite/AudienceSelector";
import VenueSection from "./components/microsite/VenueSection";
import RegistrationCTA from "./components/microsite/RegistrationCTA";
import FAQ from "./components/microsite/FAQ";
import Footer from "./components/microsite/Footer";

export default function Home() {
  const [theme, setTheme] = useState("dark");
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState("0%");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Load and apply theme from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem("grc-theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("grc-theme", nextTheme);
  };

  // Scroll listeners
  useEffect(() => {
    const handleScroll = () => {
      // Progress bar
      const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setScrollProgress(`${Math.min(pct, 100)}%`);

      // Navbar compact toggle
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection observer for navigation active states
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.getAttribute("id") || "");
          }
        });
      },
      { threshold: 0.25 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const triggerRegisterModal = () => {
    setModalOpen(true);
  };

  return (
    <>
      {/* 1. Preloader Load Screen */}
      <Preloader />

      {/* Scroll Progress line */}
      <div id="scroll-progress" style={{ width: scrollProgress }} />

      {/* 2. Tricolor Particle background */}
      <ParticlesCanvas />

      {/* Custom Mouse Cursor */}
      <CustomCursor />

      {/* 3. Sticky Navigation Header */}
      <Header
        scrolled={scrolled}
        activeSection={activeSection}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        theme={theme}
        toggleTheme={toggleTheme}
        onRegisterClick={triggerRegisterModal}
      />

      {/* 4. Cinematic 3D Particle Hero */}
      <Hero3D
        title={eventData.title}
        subtitle={eventData.subtitle}
        category={eventData.category}
        date={eventData.date}
        city={eventData.city}
        country={eventData.country}
        onRegisterClick={triggerRegisterModal}
      />

      {/* 5. Floating Pass EventDock Coordinates */}
      <EventDock
        date={eventData.date}
        time={eventData.time}
        duration={eventData.duration}
        venue={eventData.venue}
        city={eventData.city}
        country={eventData.country}
        speaker={eventData.speaker.name}
        format={eventData.format}
        status={eventData.registrationStatus}
      />

      {/* 6. Lotus Temple Storytelling Overview */}
      <Overview title={eventData.title} themeTags={eventData.themeTags} />

      {/* 7. Value Proposition Benefits Cards */}
      <WhyAttend benefits={eventData.benefits} />

      {/* 8. Rotating Radial Takeaways Orbit */}
      <TakeawayOrbit takeaways={eventData.takeaways} />

      {/* 9. Scroll agenda Timeline */}
      <AgendaTimeline agenda={eventData.agenda} />

      {/* 10. Keynote Presenter Stage Spotlight */}
      <SpeakerSpotlight speaker={eventData.speaker} />

      {/* 11. Interactive segmented Audience selector */}
      <AudienceSelector audience={eventData.audience} />

      {/* 12. Delhi Skyline Venue coordinates pass */}
      <VenueSection
        venue={eventData.venue}
        date={eventData.date}
        time={eventData.time}
        city={eventData.city}
        country={eventData.country}
        onRegisterClick={triggerRegisterModal}
      />

      {/* 13. Saffron-green moving wave CTA */}
      <RegistrationCTA
        date={eventData.date}
        city={eventData.city}
        onRegisterClick={triggerRegisterModal}
      />

      {/* 14. Information accordion desk FAQ */}
      <FAQ faqs={eventData.faqs} />

      {/* 15. Footer layout */}
      <Footer date={eventData.date} city={eventData.city} />

      {/* 16. The Enquiry Validation Modal */}
      <EnquiryModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* 17. Dynamic loading of AOS script */}
      <Script
        src="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js"
        strategy="lazyOnload"
        onLoad={() => {
          if ((window as any).AOS) {
            (window as any).AOS.init({
              duration: 750,
              easing: "ease-out-cubic",
              once: true,
              offset: 70,
            });
          }
        }}
      />
    </>
  );
}
