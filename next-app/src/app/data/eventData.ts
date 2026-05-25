export interface AgendaSession {
  time: string;
  title: string;
  desc?: string;
  type: "reg" | "keynote" | "session" | "panel" | "break" | "val" | "close" | "launch";
}

export interface TakeawayItem {
  title: string;
  desc: string;
  icon?: string;
}

export interface BenefitCard {
  title: string;
  desc: string;
  icon: string;
  type: "accent" | "green" | "gold";
}

export interface AudienceItem {
  role: string;
  icon: string;
  valueStatement: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export const eventData = {
  title: "India's GRC Leadership & Cybersecurity Conclave",
  subtitle: "India's digital future meets executive policy governance. A landmark event where policy regulators, corporate risk heads, and AI creators unite to forge trusted compliance.",
  category: "Executive Summit",
  date: "27 June 2026",
  time: "8:30 AM to 6:30 PM",
  duration: "1 Full Day",
  venue: "5-Star Premium Hotel (TBA)",
  city: "Delhi",
  country: "India",
  format: "Physical In-Person",
  registrationStatus: "Invites Open",
  
  stats: [
    { target: 500, plus: "+", label: "Leading Enterprise Clients" },
    { target: 99, plus: ".9%", label: "Threat Deflection Rate" },
    { target: 24, plus: "/7", label: "Active Monitoring Presence" },
    { target: 120, plus: "+", label: "Global Industry Experts" },
    { target: 18, plus: "+", label: "Countries Represented" }
  ],

  benefits: [
    {
      title: "Top-Tier Speakers",
      desc: "India's most senior CISOs, policy-makers, regulatory heads, and cybersecurity architects sharing live insights.",
      icon: "fa-user-shield",
      type: "accent"
    },
    {
      title: "Strategic Networking",
      desc: "Connect directly with BFSI risk heads, law enforcement leaders, and enterprise security executives in private VIP tables.",
      icon: "fa-network-wired",
      type: "green"
    },
    {
      title: "Actionable Intelligence",
      desc: "Direct guidance on India AI Mission policies, DPDPA implementation frameworks, and CERT-In reporting rules.",
      icon: "fa-brain",
      type: "gold"
    }
  ] as BenefitCard[],

  takeaways: [
    {
      title: "Digital India Outlook",
      desc: "Understand the intersection of the India AI Mission, local cloud data boundaries, and safe digital infrastructure."
    },
    {
      title: "DPDPA Compliance Map",
      desc: "Practical consent management structures, data fiduciary duties, and compliance pipelines to meet DPDPA regulations."
    },
    {
      title: "Continuous Assurance",
      desc: "Transition from periodic cybersecurity audits to continuous, automated compliance mechanisms to secure fast systems."
    },
    {
      title: "Threat Incident Models",
      desc: "Establish early threat detection structures and secure immediate 6-hour incident report procedures matching CERT-In specs."
    }
  ] as TakeawayItem[],

  agenda: [
    {
      time: "8:30 AM to 9:30 AM",
      title: "Registration & Networking Mingle",
      desc: "Welcome delegates, VIP check-in & morning coffee networking.",
      type: "reg"
    },
    {
      time: "9:30 AM to 9:45 AM",
      title: "Welcome Address & Setting the Stage",
      desc: "The Central Argument over India's GRC Moment.",
      type: "keynote"
    },
    {
      time: "9:45 AM to 10:10 AM",
      title: "Chief Guest Address + Lamp Lighting Ceremony",
      desc: "Formal Inauguration of the Conclave.",
      type: "keynote"
    },
    {
      time: "10:10 AM to 10:40 AM",
      title: "India's Digital Risk Reckoning - Why GRC Can No Longer Wait",
      desc: "High-energy, data-driven GRC problem framing for systemically critical networks.",
      type: "session"
    },
    {
      time: "10:40 AM to 11:10 AM",
      title: "Regulatory Expectations in the Age of AI - An RBI Perspective",
      desc: "RBI expectations on AI governance, vendor risks, and machine models clarified.",
      type: "keynote"
    },
    {
      time: "11:10 AM to 11:20 AM",
      title: "Transition & Q&A Buffer",
      type: "break"
    },
    {
      time: "11:20 AM to 12:05 PM",
      title: "Panel 1: AI, Regulation & the Future of GRC in Indian Financial Services",
      desc: "Top enterprise risk officers debate cross-boardroom compliance hurdles, moderated by DSCI.",
      type: "panel"
    },
    {
      time: "12:05 PM to 12:35 PM",
      title: "CERT-In & the Evolving AI Threat Landscape",
      desc: "Operationalizing six-hour AI threat reporting and system vulnerability disclosure.",
      type: "keynote"
    },
    {
      time: "12:35 PM to 12:55 PM",
      title: "Governing AI — India's National Policy Perspective",
      desc: "Government-led vision: Digital India, India AI Mission, and secure sovereign infrastructure.",
      type: "keynote"
    },
    {
      time: "12:55 PM to 1:00 PM",
      title: "Morning Wrap & Lunch Announcement",
      type: "break"
    },
    {
      time: "1:00 PM to 2:00 PM",
      title: "LUNCH BREAK - Networking Mingle",
      type: "break"
    },
    {
      time: "2:00 PM to 2:15 PM",
      title: "The Human Mind in the Age of AI - Post-Lunch Experience",
      desc: "Re-energising shift from regulation to high-speed automation solutions.",
      type: "session"
    },
    {
      time: "2:15 PM to 2:45 PM",
      title: "Building the Always-On Enterprise - A CISO's Perspective on Continuous Compliance",
      desc: "SEBI-regulated, systemically critical practitioner voice detailing always-audit environments.",
      type: "keynote"
    },
    {
      time: "2:45 PM to 3:00 PM",
      title: "ComplyX Launch: Mirror | Wizard | GRACE",
      desc: "Vision-led journey to next-gen compliance brand announcement.",
      type: "launch"
    },
    {
      time: "3:00 PM to 3:45 PM",
      title: "Panel 2: From Compliance Burden to Competitive Advantage - The AI-Enabled GRC Transformation",
      desc: "Accelerating vendor assessments (TPRM), contract sweeps, and automated reports with generative AI.",
      type: "panel"
    },
    {
      time: "3:45 PM to 4:00 PM",
      title: "White Paper Launch: India AI Governance & Continuous Compliance Outlook 2026",
      desc: "Signature photo moment for press coverage.",
      type: "launch"
    },
    {
      time: "4:00 PM to 4:30 PM",
      title: "HI-TEA & NETWORKING EXPO",
      type: "break"
    },
    {
      time: "4:30 PM to 4:55 PM",
      title: "Data Privacy in the Age of AI: What DPDPA 2023 Means for India's Digital Enterprises",
      desc: "Detailed breakout on consent managers, data fiduciary roles, and heavy penalty maps.",
      type: "keynote"
    },
    {
      time: "4:55 PM to 5:10 PM",
      title: "Closing Address: What India's GRC Community Must Do Next",
      desc: "Forward-looking call to industry action.",
      type: "close"
    },
    {
      time: "5:10 PM to 5:22 PM",
      title: "Valedictory Address",
      desc: "Government close signals policy-led platform growth.",
      type: "val"
    },
    {
      time: "5:22 PM to 5:30 PM",
      title: "Vote of Thanks & Close",
      desc: "GRC 2027 seeded, Ampcus final appearance.",
      type: "close"
    }
  ] as AgendaSession[],

  speaker: {
    role: "National Policy Authorities",
    name: "To Be Announced",
    org: "Ampcus Board & National Regulators",
    bio: "The speaker panel comprises senior directors of information security from systemically critical enterprises, officials from regulatory agencies (such as RBI and DSCI), threat research heads from national monitoring centers (such as CERT-In), and strategic security architects from Ampcus Cyber.",
    tags: ["AI Governance", "National Security", "Regulatory Law"]
  },

  themeTags: [
    "AI in Cybersecurity",
    "Cyber Risk Quantification",
    "Continuous Compliance",
    "DPDP Act",
    "Cloud Security",
    "AI Resilience",
    "Threat Intelligence",
    "TPRM",
    "Ransomware",
    "Identity & Access",
    "Incident Response",
    "Data Privacy",
    "Digital Forensics",
    "GRC",
    "Security Testing",
    "InfoSec"
  ],

  audience: [
    {
      role: "CISO & CSOs",
      icon: "fa-user-shield",
      valueStatement: "Gain practical insights on building continuous defense systems, automating incident report filings, and aligning risk metrics directly with boardroom objectives."
    },
    {
      role: "Risk & Compliance Leaders",
      icon: "fa-balance-scale",
      valueStatement: "Master DPDPA 2023 consent mapping, implement scalable audit pipelines, and turn compliance tasks from costs into real business advantages."
    },
    {
      role: "CIO & CTOs",
      icon: "fa-sitemap",
      valueStatement: "Learn to design secure AI systems, manage data residency across borders, and select modern automation tools without slowing development speed."
    },
    {
      role: "Regulators & Government",
      icon: "fa-university",
      valueStatement: "Review the development of the India AI Mission, share regulatory targets for Bfsi models, and discuss standards to prevent sovereign cyber threats."
    },
    {
      role: "BFSI & Enterprise Leaders",
      icon: "fa-building",
      valueStatement: "Discover automated vendor checks (TPRM) that lower compliance overhead and protect against critical system network issues."
    },
    {
      role: "Security Vendors & Innovators",
      icon: "fa-rocket",
      valueStatement: "Demonstrate cutting-edge compliance tools, collaborate with C-suite buyers, and join high-level debates on AI resilience."
    }
  ] as AudienceItem[],

  faqs: [
    {
      q: "What is the GRC Asia Conclave - India 2026?",
      a: "It is an exclusive, invitation-only executive summit for Governance, Risk & Compliance professionals, CISOs, enterprise policy-makers, and security leaders hosted by Ampcus Cyber. The event addresses cutting-edge strategies in cybersecurity, DPDPA implementation, and AI governance."
    },
    {
      q: "Who is eligible to attend?",
      a: "Attendance is structured specifically for C-suite risk heads, Chief Information Security Officers (CISOs), risk managers, CTOs, CIOs, financial policy regulators, law enforcement, and government leaders."
    },
    {
      q: "Is there a fee to register?",
      a: "Initial interest registrations are complimentary but subject to rigorous evaluation by the Ampcus Cyber board due to restricted invitation slots. Successful delegates will receive a formal invite pass."
    },
    {
      q: "What is the format of the event?",
      a: "The conclave is a comprehensive one-day, physical, in-person summit in Mumbai featuring strategic panels, keynote briefs, technology showcases, executive roundtables, and VIP high-tea networking."
    },
    {
      q: "Will there be certifications?",
      a: "Yes! All confirmed delegates who attend the sessions will be awarded official Governance, Risk & Compliance CPE certification hours upon completion."
    }
  ] as FAQItem[]
};
