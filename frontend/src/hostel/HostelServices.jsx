
import { useState } from "react";
import "./HostelServices.css";

import {
  getComplaints,
  saveComplaints,
  getAnnouncements,
} from "./hostelStorage";

import { calculateComplaintSeverity } from "./complaintSeverity";

function HostelServices() {
  const [activeTab, setActiveTab] = useState("complaint");
  const [complaints, setComplaints] = useState(() => getComplaints());
  const [announcements, setAnnouncements] = useState(
    () => getAnnouncements()
  );

  const initialForm = {
    title: "",
    category: "Electrical",
    room: "",
    description: "",
    safetyRisk: "0",
    severity: "1",
    impact: "1",
    immediateDanger: false,
  };

  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");

  function openTab(tab) {
    setActiveTab(tab);
    setMessage("");
    setComplaints(getComplaints());
    setAnnouncements(getAnnouncements());
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const title = form.title.trim();
    const room = form.room.trim();
    const description = form.description.trim();

    if (!title || !room || !description) {
      setMessage("Please complete all required fields.");
      return;
    }

    let assessment;

    try {
      assessment = calculateComplaintSeverity({
        safetyRisk: Number(form.safetyRisk),
        severity: Number(form.severity),
        impact: Number(form.impact),
        immediateDanger: form.immediateDanger,
      });
    } catch {
      setMessage("Please check the complaint assessment values.");
      return;
    }

    const complaint = {
      id: `CMP-${Date.now().toString().slice(-6)}`,
      title,
      category: form.category,
      room,
      description,
      safetyRisk: Number(form.safetyRisk),
      severity: Number(form.severity),
      impact: Number(form.impact),
      immediateDanger: form.immediateDanger,
      severityScore: assessment.score,
      priority: assessment.priority,
      immediateReview: assessment.immediateReview,
      status: "SUBMITTED",
      date: new Date().toLocaleDateString(),
      createdAt: new Date().toISOString(),
    };

    const updatedComplaints = [
      complaint,
      ...getComplaints(),
    ];

    saveComplaints(updatedComplaints);
    setComplaints(updatedComplaints);
    setForm({ ...initialForm });
    setMessage(`Complaint ${complaint.id} submitted successfully!`);
    setActiveTab("tracking");
  }

  return (
    <div className="hostel-page">
      <section className="hostel-hero">
        <span className="hostel-badge">
          CAMPUSEASE · HOSTEL SERVICES
        </span>

        <h1>
          Your hostel, <span>your comfort.</span>
        </h1>

        <p>
          Report maintenance issues, track your complaints,
          and stay informed with hostel announcements.
        </p>

        <div className="hostel-stats">
          <div>
            <strong>{complaints.length}</strong>
            <span>Total Complaints</span>
          </div>

          <div>
            <strong>
              {complaints.filter(
                (item) => item.status !== "RESOLVED"
              ).length}
            </strong>
            <span>Pending Complaints</span>
          </div>

          <div>
            <strong>
              {complaints.filter(
                (item) => item.status === "RESOLVED"
              ).length}
            </strong>
            <span>Resolved Complaints</span>
          </div>
        </div>
      </section>

      <section className="hostel-content">
        <div className="hostel-heading">
          <span className="hostel-eyebrow">
            HOSTEL HELP DESK
          </span>

          <h2>How can we help you?</h2>
          <p>Choose an option below to get started.</p>
        </div>

        <div className="hostel-tabs">
          <button
            className={activeTab === "complaint" ? "active" : ""}
            onClick={() => openTab("complaint")}
          >
            📝 Submit Complaint
          </button>

          <button
            className={activeTab === "tracking" ? "active" : ""}
            onClick={() => openTab("tracking")}
          >
            📋 My Complaints
          </button>

          <button
            className={activeTab === "announcements" ? "active" : ""}
            onClick={() => openTab("announcements")}
          >
            📢 Announcements
          </button>
        </div>

        {message && (
          <div className="hostel-message" role="status">
            {message}
          </div>
        )}

        {activeTab === "complaint" && (
          <form className="complaint-form" onSubmit={handleSubmit}>
            <h3>Report a Hostel Issue</h3>

            <p className="form-description">
              Describe the problem and provide an initial assessment.
              The warden should verify the severity and safety risks.
            </p>

            <div className="form-grid">
              <label>
                Complaint Title
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Broken room light"
                  required
                  maxLength={100}
                />
              </label>

              <label>
                Category
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option>Electrical</option>
                  <option>Plumbing</option>
                  <option>Cleaning</option>
                  <option>Wi-Fi / Internet</option>
                  <option>Furniture</option>
                  <option>Other</option>
                </select>
              </label>

              <label>
                Room Number
                <input
                  name="room"
                  value={form.room}
                  onChange={handleChange}
                  placeholder="e.g. B-204"
                  required
                  maxLength={20}
                />
              </label>

              <label className="full-width">
                Describe the Problem
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Explain the issue..."
                  rows={4}
                  required
                  maxLength={1000}
                />
              </label>

              <label>
                Safety Risk
                <select
                  name="safetyRisk"
                  value={form.safetyRisk}
                  onChange={handleChange}
                >
                  <option value="0">0 - No obvious risk</option>
                  <option value="1">1 - Very low</option>
                  <option value="2">2 - Low</option>
                  <option value="3">3 - Moderate</option>
                  <option value="4">4 - High</option>
                  <option value="5">5 - Very high</option>
                </select>
              </label>

              <label>
                Problem Severity
                <select
                  name="severity"
                  value={form.severity}
                  onChange={handleChange}
                >
                  <option value="1">1 - Minor</option>
                  <option value="2">2 - Mild</option>
                  <option value="3">3 - Moderate</option>
                  <option value="4">4 - Serious</option>
                  <option value="5">5 - Very serious</option>
                </select>
              </label>

              <label>
                People Affected
                <select
                  name="impact"
                  value={form.impact}
                  onChange={handleChange}
                >
                  <option value="1">1 - One person</option>
                  <option value="2">2 - A few people</option>
                  <option value="3">3 - Several people</option>
                  <option value="4">4 - Many people</option>
                  <option value="5">5 - Entire block or more</option>
                </select>
              </label>

              <label className="full-width">
                <span>
                  <input
                    type="checkbox"
                    name="immediateDanger"
                    checked={form.immediateDanger}
                    onChange={(event) => {
                      setForm((previous) => ({
                        ...previous,
                        immediateDanger: event.target.checked,
                      }));
                    }}
                  />
                  {" "}Possible immediate danger
                </span>
                <span className="form-description">
                  Tick this if someone may be in immediate danger.
                  This should trigger urgent warden review.
                </span>
              </label>
            </div>

            <button className="hostel-submit" type="submit">
              Submit Complaint →
            </button>
          </form>
        )}

        {activeTab === "tracking" && (
          <div className="complaints-panel">
            <h3>Your Complaints</h3>

            {complaints.length === 0 ? (
              <div className="hostel-empty">
                <span>📋</span>
                <h4>No complaints yet</h4>
                <p>
                  Your submitted hostel complaints will appear here.
                </p>
                <button
                  type="button"
                  className="hostel-secondary"
                  onClick={() => openTab("complaint")}
                >
                  Report an Issue
                </button>
              </div>
            ) : (
              <div className="complaint-list">
                {complaints.map((complaint) => (
                  <article
                    className="complaint-card"
                    key={complaint.id}
                  >
                    <div className="complaint-card-top">
                      <div>
                        <span className="complaint-id">
                          {complaint.id}
                        </span>
                        <h4>{complaint.title}</h4>
                      </div>

                      <span
                        className={`status-pill ${String(
                          complaint.status
                        ).toLowerCase()}`}
                      >
                        {complaint.status.replace("_", " ")}
                      </span>
                    </div>

                    <p>{complaint.description}</p>

                    <div className="complaint-meta">
                      <span>Category: {complaint.category}</span>
                      <span>Room: {complaint.room}</span>
                      <span>Date: {complaint.date}</span>
                    </div>

                    {complaint.severityScore !== undefined && (
                      <div className="complaint-meta">
                        <span>
                          Priority: {complaint.priority}
                        </span>
                        <span>
                          Severity score: {complaint.severityScore}/40
                        </span>
                        {complaint.immediateReview && (
                          <strong>
                            ⚠️ Requires immediate review
                          </strong>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "announcements" && (
          <div className="announcements-panel">
            <h3>Hostel Announcements</h3>

            <p className="form-description">
              Stay updated with important hostel notices.
            </p>

            {announcements.map((announcement) => (
              <article
                className="announcement-card"
                key={announcement.id}
              >
                <div className="announcement-icon">📢</div>
                <div>
                  <h4>{announcement.title}</h4>
                  <p>{announcement.message}</p>
                  <span>{announcement.date}</span>
                </div>
              </article>
            ))}

            {announcements.length === 0 && (
              <p>No announcements available.</p>
            )}
          </div>
        )}
      </section>

      <footer className="hostel-footer">
        <p>
          CampusEase · Hostel Convenience & Governance
        </p>
      </footer>
    </div>
  );
}

export default HostelServices;
