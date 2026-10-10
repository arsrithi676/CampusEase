
import HostelServices from "./hostel/HostelServices";
import HostelPortalSelection from "./hostel/HostelPortalSelection";
import WardenDashboard from "./hostel/WardenDashboard";

import { useState } from "react";
import "./App.css";

const services = [
  {
    icon: "🍽️",
    title: "Main Canteens",
    description: "Order meals and skip the queue.",
    detail: "canteens",
  },
  {
    icon: "🌙",
    title: "Night Canteen",
    description: "Order late-night snacks and meals.",
    detail: "night",
  },
  {
    icon: "🛍️",
    title: "Campus Store",
    description: "Get groceries and daily essentials.",
    detail: "store",
  },
  {
    icon: "🏠",
    title: "Hostel Services",
    description: "Submit complaints and track updates.",
    detail: "hostel",
  },
];

function App() {
  const [selectedService, setSelectedService] = useState(null);
  
  if (selectedService === "warden") {
  return (
    <div>
      <button
        onClick={() => setSelectedService(null)}
        style={{ margin: "16px", padding: "10px 16px", cursor: "pointer" }}
      >
        ← Back to CampusEase
      </button>

      <WardenDashboard />
    </div>
  );
}
  
  
  
  if (selectedService === "hostel") {
  return (
    <HostelPortalSelection
      onBack={() => setSelectedService(null)}
    />
  );
}

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#" onClick={() => setSelectedService(null)}>
          <span className="brand-icon">C</span>
          CampusEase
        </a>
        <span className="tagline">Your campus, made easier.</span>
        <button className="login-button" onClick={() => alert("Login module coming soon!")}>
          Student Login
        </button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-badge">GENESIS'26 · HACKATHON PROJECT</div>
          <h1>Campus life,<br /><span>made simpler.</span></h1>
          <p>
            One platform for campus food, daily essentials, and hostel services.
            Less waiting, more living.
          </p>
          <button
            className="primary-button"
            onClick={() => document.getElementById("services").scrollIntoView({ behavior: "smooth" })}
          >
            Explore Services ↓
          </button>
          <div className="hero-decoration decoration-one">✳</div>
          <div className="hero-decoration decoration-two">✦</div>
        </section>

        <section className="services-section" id="services">
          <div className="section-heading">
            <span className="eyebrow">EVERYTHING IN ONE PLACE</span>
            <h2>What do you need today?</h2>
            <p>Choose a service to get started.</p>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <button
                key={service.detail}
                className={`service-card ${selectedService === service.detail ? "selected" : ""}`}
                onClick={() => setSelectedService(service.detail)}
              >
                <span className="service-icon">{service.icon}</span>
                <span className="service-title">{service.title}</span>
                <span className="service-description">{service.description}</span>
                <span className="card-link">Open service ↗</span>
              </button>
            ))}
          </div>

          {selectedService && (
            <div className="selection-panel">
              <p>
                You selected <strong>
                  {services.find((service) => service.detail === selectedService)?.title}
                </strong>.
              </p>
              <p>This module is ready for us to build next.</p>
              <button className="primary-button" onClick={() => setSelectedService(null)}>
                Back to services
              </button>
            </div>
          )}
        </section>

        <section className="benefits">
          <div><strong>One platform</strong><span>Four campus services</span></div>
          <div><strong>Less waiting</strong><span>Token-based ordering</span></div>
          <div><strong>Clear updates</strong><span>Track orders and complaints</span></div>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#">CampusEase</a>
        <p>Built for Genesis'26 · Amrita Vishwa Vidyapeetham</p>
      </footer>
    </div>
  );
}

export default App;
