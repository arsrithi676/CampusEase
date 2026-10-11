import { useState } from "react";

import "./App.css";

import Marketplace from "./marketplace/Marketplace";

import HostelPortalSelection from "./hostel/HostelPortalSelection";
import WardenDashboard from "./hostel/WardenDashboard";
import Canteens from "./pages/Canteens";

const services = [
  {
    icon: "🍽️",
    title: "Main Canteen",
    description: "Explore meals, order food, and reduce waiting time.",
    detail: "canteens",
    category: "FOOD & DINING",
  },
  {
    icon: "🌙",
    title: "Night Canteen",
    description: "Discover late-night snacks and meals on campus.",
    detail: "night",
    category: "FOOD & DINING",
  },
  {
    icon: "🛍️",
    title: "Campus Store",
    description: "Find groceries and everyday campus essentials.",
    detail: "store",
    category: "CAMPUS ESSENTIALS",
  },
  {
    icon: "🏠",
    title: "Hostel Services",
    description: "Submit hostel complaints and track their progress.",
    detail: "hostel",
    category: "STUDENT SERVICES",
  },
  {
    icon: "🤝",
    title: "Skill Marketplace",
    description:
      "Discover student services, share your skills, and explore learning resources.",
    detail: "marketplace",
    category: "SKILLS & LEARNING",
  },
];

function App() {
  const [selectedService, setSelectedService] = useState(null);

  // Warden dashboard
  if (selectedService === "warden") {
    return (
      <div className="module-page">
        <button
          className="back-button"
          onClick={() => setSelectedService(null)}
        >
          ← Back to CampusEase
        </button>

        <WardenDashboard />
      </div>
    );
  }

  // Hostel portal
  if (selectedService === "hostel") {
    return (
      <HostelPortalSelection
        onBack={() => setSelectedService(null)}
      />
    );
  }

  // Marketplace module
  if (selectedService === "marketplace") {
    return (
      <div className="module-page">
        <div className="module-navigation">
          <a
            className="brand"
            href="#home"
            onClick={(event) => {
              event.preventDefault();
              setSelectedService(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span className="brand-icon">C</span>
            CampusEase
          </a>

          <button
            className="back-button"
            onClick={() => setSelectedService(null)}
          >
            ← Back to Home
          </button>
        </div>

        <Marketplace />
      </div>
    );
  }
  if (selectedService === "canteens" || selectedService === "night") {
  return (
    <Canteens
      canteenName={selectedService === "night" ? "Night Canteen" : "Main Canteen"}
      onBack={() => setSelectedService(null)}
    />
  );
}

  const activeService = services.find(
    (service) => service.detail === selectedService
  );

  return (
    <div className="app" id="home">
      {/* Navigation */}
      <header className="navbar">
        <a
          className="brand"
          href="#home"
          onClick={() => {
            setSelectedService(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="brand-icon">C</span>
          <span>CampusEase</span>
        </a>

        <span className="tagline">
          Your campus, made easier.
        </span>

        <button
          className="login-button"
          onClick={() =>
            window.alert(
              "Student Login is a demo feature and is not available yet."
            )
          }
        >
          Student Login
        </button>
      </header>

      <main>
        {/* Hero */}
        <section className="hero">
          <div className="hero-content">
            <div className="hero-badge">
              GENESIS'26 · HACKATHON PROJECT
            </div>

            <h1>
              Campus life,
              <br />
              <span>made simpler.</span>
            </h1>

            <p>
              One platform for campus food, everyday essentials,
              hostel services, and student skills.
              Spend less time waiting and more time learning.
            </p>

            <button
              className="primary-button"
              onClick={() =>
                document
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Services <span aria-hidden="true">↓</span>
            </button>

            <div
              className="hero-decoration decoration-one"
              aria-hidden="true"
            >
              ✳
            </div>

            <div
              className="hero-decoration decoration-two"
              aria-hidden="true"
            >
              ✦
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="services-section" id="services">
          <div className="section-heading">
            <span className="eyebrow">
              YOUR CAMPUS, CONNECTED
            </span>

            <h2>What do you need today?</h2>

            <p>
              Access campus services from one convenient place.
            </p>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <button
                key={service.detail}
                type="button"
                className={`service-card ${
                  selectedService === service.detail ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedService(service.detail);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <span className="service-category">
                  {service.category}
                </span>

                <span className="service-icon" aria-hidden="true">
                  {service.icon}
                </span>

                <span className="service-title">
                  {service.title}
                </span>

                <span className="service-description">
                  {service.description}
                </span>

                <span className="card-link">
                  Open service <span aria-hidden="true">↗</span>
                </span>
              </button>
            ))}
          </div>

          {/* Placeholder for services not yet integrated */}
          {activeService &&
            ["canteens", "night", "store"].includes(
              activeService.detail
            ) && (
              <div className="selection-panel">
                <span className="panel-icon">
                  {activeService.icon}
                </span>

                <h3>{activeService.title}</h3>

                <p>
                  {activeService.description}
                </p>

                <p className="demo-notice">
                  This service is awaiting integration with its
                  existing module.
                </p>

                <button
                  className="primary-button"
                  onClick={() => setSelectedService(null)}
                >
                  Back to Services
                </button>
              </div>
            )}
        </section>

        {/* Benefits */}
        <section className="benefits-section">
          <div className="benefits-heading">
            <span className="eyebrow">WHY CAMPUSEASE?</span>
            <h2>A simpler campus experience</h2>
          </div>

          <div className="benefits">
            <div className="benefit-item">
              <span className="benefit-icon">⚡</span>
              <strong>Save Time</strong>
              <span>Access campus services conveniently.</span>
            </div>

            <div className="benefit-item">
              <span className="benefit-icon">🎓</span>
              <strong>Student Focused</strong>
              <span>Designed around everyday campus needs.</span>
            </div>

            <div className="benefit-item">
              <span className="benefit-icon">🔗</span>
              <strong>One Platform</strong>
              <span>Discover multiple campus services together.</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <a
          className="brand footer-brand"
          href="#home"
          onClick={() => {
            setSelectedService(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="brand-icon">C</span>
          CampusEase
        </a>

        <p>
          Built for Genesis'26 · Amrita Vishwa Vidyapeetham
        </p>

        <span className="footer-caption">
          Making campus life easier.
        </span>
      </footer>
    </div>
  );
}

export default App;