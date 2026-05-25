"use client";
import React, { useState, useEffect } from "react";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnquiryModal({ isOpen, onClose }: EnquiryModalProps) {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    company: "",
    designation: "",
    interest: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  // Focus trap / lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (shake) {
      const styleId = "shake-animation-style";
      if (!document.getElementById(styleId)) {
        const s = document.createElement("style");
        s.id = styleId;
        s.textContent = `
          .shake-form {
            animation: formShake 0.35s ease-in-out;
          }
          @keyframes formShake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-7px); }
            40%, 80% { transform: translateX(7px); }
          }
        `;
        document.head.appendChild(s);
      }
    }
  }, [shake]);

  if (!isOpen) return null;

  const rules: Record<string, { regex: RegExp; msg: string }> = {
    fname: { regex: /^[A-Za-z][A-Za-z\s'-]{1,49}$/, msg: "First name: 2–50 letters only." },
    lname: { regex: /^[A-Za-z][A-Za-z\s'-]{1,49}$/, msg: "Last name: 2–50 letters only." },
    email: { regex: /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/, msg: "Enter a valid work email." },
    phone: { regex: /^(?:\+?\d{1,3})?[6-9]\d{9}$/, msg: "Enter a valid 10-digit phone number." },
    company: { regex: /^[A-Za-z0-9].{1,98}$/, msg: "Company name: 2–100 characters." },
    designation: { regex: /^[A-Za-z].{1,78}$/, msg: "Designation: 2–80 characters." },
    interest: { regex: /^(delegate|vip|speaking|sponsorship|media|other)$/, msg: "Please select an option." },
    message: { regex: /^[\s\S]{20,1000}$/, msg: "Message: 20–1000 characters." },
  };

  const validateField = (name: string, value: string) => {
    const val = value.trim();
    if (!val) {
      return "This field is required.";
    }
    const rule = rules[name];
    if (rule && !rule.regex.test(val)) {
      return rule.msg;
    }
    return "";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors: Record<string, string> = {};

    Object.keys(formData).forEach((key) => {
      const errorMsg = validateField(key, formData[key as keyof typeof formData]);
      if (errorMsg) {
        newErrors[key] = errorMsg;
        valid = false;
      }
    });

    if (!valid) {
      setErrors(newErrors);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (result.errors) {
          setErrors(result.errors);
        }
        throw new Error(result.message || "Submission failed.");
      }

      setIsSuccess(true);
      setFormData({
        fname: "",
        lname: "",
        email: "",
        phone: "",
        company: "",
        designation: "",
        interest: "",
        message: "",
      });

      setTimeout(() => {
        setIsSuccess(false);
        setIsSubmitting(false);
        onClose();
      }, 2400);

    } catch (err) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setIsSubmitting(false);
    }
  };

  return (
    <div id="enquiryModal" className="modal-overlay open" aria-hidden="false">
      <div className="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="enquiryModalTitle">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close enquiry form">
          <i className="fas fa-times"></i>
        </button>
        <div className="contact-form-wrap modal-form-wrap">
          <span className="section-tag">Get in Touch</span>
          <h2 className="section-title" id="enquiryModalTitle">
            Submit Your <span className="gradient-text">Enquiry</span>
          </h2>

          <form
            className={`contact-form ${shake ? "shake-form" : ""}`}
            onSubmit={handleSubmit}
            style={isSuccess ? { display: "none" } : undefined}
            noValidate
          >
            <div className="form-row">
              <div className={`form-group ${errors.fname ? "error" : ""}`}>
                <label htmlFor="fname">First Name *</label>
                <input
                  type="text"
                  id="fname"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="John"
                  required
                />
                <small className="field-error" id="fname-error">
                  {errors.fname}
                </small>
              </div>
              <div className={`form-group ${errors.lname ? "error" : ""}`}>
                <label htmlFor="lname">Last Name *</label>
                <input
                  type="text"
                  id="lname"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Doe"
                  required
                />
                <small className="field-error" id="lname-error">
                  {errors.lname}
                </small>
              </div>
            </div>

            <div className="form-row">
              <div className={`form-group ${errors.email ? "error" : ""}`}>
                <label htmlFor="email">Work Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="john@company.com"
                  required
                />
                <small className="field-error" id="email-error">
                  {errors.email}
                </small>
              </div>
              <div className={`form-group ${errors.phone ? "error" : ""}`}>
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="+919876543210"
                  required
                />
                <small className="field-error" id="phone-error">
                  {errors.phone}
                </small>
              </div>
            </div>

            <div className={`form-group ${errors.company ? "error" : ""}`}>
              <label htmlFor="company">Company / Organisation *</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Your Organisation"
                required
              />
              <small className="field-error" id="company-error">
                {errors.company}
              </small>
            </div>

            <div className={`form-group ${errors.designation ? "error" : ""}`}>
              <label htmlFor="designation">Designation *</label>
              <input
                type="text"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="CISO / VP Security..."
                required
              />
              <small className="field-error" id="designation-error">
                {errors.designation}
              </small>
            </div>

            <div className={`form-group ${errors.interest ? "error" : ""}`}>
              <label htmlFor="interest">I'm interested in *</label>
              <select
                id="interest"
                name="interest"
                value={formData.interest}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              >
                <option value="">Select an option</option>
                <option value="delegate">Attending as Delegate</option>
                <option value="vip">VIP / Executive Pass</option>
                <option value="speaking">Speaking Opportunity</option>
                <option value="sponsorship">Sponsorship / Partnership</option>
                <option value="media">Media / Press</option>
                <option value="other">Other</option>
              </select>
              <small className="field-error" id="interest-error">
                {errors.interest}
              </small>
            </div>

            <div className={`form-group ${errors.message ? "error" : ""}`}>
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={4}
                placeholder="Tell us more about your interest..."
                required
              ></textarea>
              <small className="field-error" id="message-error">
                {errors.message}
              </small>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-glow" disabled={isSubmitting}>
              <span>{isSubmitting ? "Sending..." : "Submit Enquiry"}</span>
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>

          {isSuccess && (
            <div id="form-success" className="form-success">
              <i className="fas fa-check-circle" style={{ color: "#22c55e", fontSize: "3rem", marginBottom: "1rem" }}></i>
              <p>Thank you! We'll be in touch shortly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
