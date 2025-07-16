import React from "react";

import "./WhySmartApply.css";

const features = [
  {
    icon: "🎯",
    title: "Precision Job Matching",
    desc: "SmartApply analyzes job descriptions & your resume to match you with the right roles using AI.",
  },
  {
    icon: "🤖",
    title: "Automated Applications",
    desc: "Sit back as SmartApply fills job forms & applies for roles on your behalf.",
  },
  {
    icon: "📄",
    title: "Tailored Resumes & Cover Letters",
    desc: "Generate customized documents that match each job using AI.",
  },
  {
    icon: "🔍",
    title: "Job Tracking Dashboard",
    desc: "Get a visual tracker to monitor where you've applied and what’s pending.",
  },
  {
    icon: "📬",
    title: "Instant Email Alerts",
    desc: "Get notified instantly when a job is matched, applied, or needs attention.",
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    desc: "Your data is encrypted and never shared. You're always in control.",
  },
];

const WhySmartApply = () => {

  return (
    <section className="why-section" id='why-smartapply'>
      <div className="why-container">
        <h2 className="why-heading">Why SmartApply?</h2>
        <p className="why-subheading">Your AI-powered partner in job hunting</p>
        <div className="why-grid">
          {features.map((feature, index) => (
            <div className="why-card" key={index}>
              <div className="why-icon">{feature.icon}</div>
              <h3 className="why-title">{feature.title}</h3>
              <p className="why-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySmartApply;
