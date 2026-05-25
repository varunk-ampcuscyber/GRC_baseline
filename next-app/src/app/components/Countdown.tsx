"use client";
import React, { useState, useEffect } from "react";

export default function Countdown() {
  const [days, setDays] = useState("00");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");

  const [daysPct, setDaysPct] = useState(1);
  const [hoursPct, setHoursPct] = useState(1);
  const [minutesPct, setMinutesPct] = useState(1);
  const [secondsPct, setSecondsPct] = useState(1);

  const circum = 339.292; // 2 * PI * 54

  useEffect(() => {
    const eventDate = new Date("2026-06-27T09:00:00+05:30");

    function tick() {
      const diff = Math.max(0, eventDate.getTime() - new Date().getTime());

      if (diff === 0) {
        setDays("00");
        setHours("00");
        setMinutes("00");
        setSeconds("00");

        setDaysPct(0);
        setHoursPct(0);
        setMinutesPct(0);
        setSecondsPct(0);
        return;
      }

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      setDays(String(d).padStart(2, "0"));
      setHours(String(h).padStart(2, "0"));
      setMinutes(String(m).padStart(2, "0"));
      setSeconds(String(s).padStart(2, "0"));

      setDaysPct(Math.max(0, Math.min(1, d / 365)));
      setHoursPct(Math.max(0, Math.min(1, h / 24)));
      setMinutesPct(Math.max(0, Math.min(1, m / 60)));
      setSecondsPct(Math.max(0, Math.min(1, s / 60)));
    }

    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, []);

  const getOffset = (pct: number) => {
    return circum - pct * circum;
  };

  return (
    <div className="reactor-countdown-wrap" data-aos="fade-up" data-aos-delay="800">
      <p className="rc-title">
        <span className="rc-dot"></span> Event Initialization Sequence{" "}
        <span className="rc-dot"></span>
      </p>

      <div className="reactor-countdown" id="countdown">
        {/* Days */}
        <div className="rc-core">
          <div className="rc-ring-wrap">
            <svg className="rc-svg" viewBox="0 0 120 120">
              <circle className="rc-svg-track" cx="60" cy="60" r="54"></circle>
              <circle
                className="rc-svg-progress"
                cx="60"
                cy="60"
                r="54"
                style={{ strokeDashoffset: getOffset(daysPct), transition: "stroke-dashoffset 1s ease" }}
              ></circle>
            </svg>
            <div className="rc-spin-outer"></div>
            <div className="rc-spin-inner"></div>
            <div className="rc-glow"></div>
            <div className="rc-num-container">
              <div className="rc-num">{days}</div>
            </div>
          </div>
          <div className="rc-label">Days</div>
        </div>

        {/* Hours */}
        <div className="rc-core rc-core-hours">
          <div className="rc-ring-wrap">
            <svg className="rc-svg" viewBox="0 0 120 120">
              <circle className="rc-svg-track" cx="60" cy="60" r="54"></circle>
              <circle
                className="rc-svg-progress"
                cx="60"
                cy="60"
                r="54"
                style={{ strokeDashoffset: getOffset(hoursPct), transition: "stroke-dashoffset 1s ease" }}
              ></circle>
            </svg>
            <div className="rc-spin-outer"></div>
            <div className="rc-spin-inner"></div>
            <div className="rc-glow"></div>
            <div className="rc-num-container">
              <div className="rc-num">{hours}</div>
            </div>
          </div>
          <div className="rc-label">Hours</div>
        </div>

        {/* Minutes */}
        <div className="rc-core rc-core-mins">
          <div className="rc-ring-wrap">
            <svg className="rc-svg" viewBox="0 0 120 120">
              <circle className="rc-svg-track" cx="60" cy="60" r="54"></circle>
              <circle
                className="rc-svg-progress"
                cx="60"
                cy="60"
                r="54"
                style={{ strokeDashoffset: getOffset(minutesPct), transition: "stroke-dashoffset 1s ease" }}
              ></circle>
            </svg>
            <div className="rc-spin-outer"></div>
            <div className="rc-spin-inner"></div>
            <div className="rc-glow"></div>
            <div className="rc-num-container">
              <div className="rc-num">{minutes}</div>
            </div>
          </div>
          <div className="rc-label">Minutes</div>
        </div>

        {/* Seconds */}
        <div className="rc-core rc-core-secs">
          <div className="rc-ring-wrap">
            <svg className="rc-svg" viewBox="0 0 120 120">
              <circle className="rc-svg-track" cx="60" cy="60" r="54"></circle>
              <circle
                className="rc-svg-progress"
                id="rc-prog-secs"
                cx="60"
                cy="60"
                r="54"
                style={{ strokeDashoffset: getOffset(secondsPct), transition: "stroke-dashoffset 1s ease" }}
              ></circle>
            </svg>
            <div className="rc-spin-outer"></div>
            <div className="rc-spin-inner"></div>
            <div className="rc-glow"></div>
            <div className="rc-num-container">
              <div className="rc-num">{seconds}</div>
            </div>
          </div>
          <div className="rc-label">Seconds</div>
        </div>
      </div>
    </div>
  );
}
