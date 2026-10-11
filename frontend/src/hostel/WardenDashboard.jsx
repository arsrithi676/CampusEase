
import { useState } from "react";
import "./WardenDashboard.css";

import {
  getComplaints,
  saveComplaints,
  getAnnouncements,
  saveAnnouncements,
} from "./hostelStorage";

const statusOptions = [
  "SUBMITTED",
  "ACKNOWLEDGED",
  "IN_PROGRESS",
  "RESOLVED",
];

function WardenDashboard() {
  const [complaints, setComplaints] = useState(
    () => getComplaints()
  );

  const [announcements, setAnnouncements] = useState(
    () => getAnnouncements()
  );

  const [activeTab, setActiveTab] = useState("complaints");

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    message: "",
  });

  const [notice, setNotice] = useState("");

  function refreshData() {
    setComplaints(getComplaints());
    setAnnouncements(getAnnouncements());
  }

  function updateStatus(id, newStatus) {
    const updatedComplaints = getComplaints().map(
      (complaint) =>
        complaint.id === id
          ? { ...complaint, status: newStatus }
          : complaint
    );

    saveComplaints(updatedComplaints);
    setComplaints(updatedComplaints);

    setNotice(
      `Complaint ${id} updated to ${newStatus.replace("_", " ")}.`
    );
  }

  function handleAnnouncementChange(event) {
    const { name, value } = event.target;

    setAnnouncementForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function publishAnnouncement(event) {
    event.preventDefault();

    const title = announcementForm.title.trim();
    const message = announcementForm.message.trim();

    if (!title || !message) {
      setNotice("Please enter both a title and a message.");
      return;
    }

    const newAnnouncement = {
      id: Date.now(),
      title,
      message,
      date: new Date().toLocaleDateString(),
    };

    const updatedAnnouncements = [
      newAnnouncement,
      ...getAnnouncements(),
    ];

    saveAnnouncements(updatedAnnouncements);
    setAnnouncements(updatedAnnouncements);

    setAnnouncementForm({
      title: "",
      message: "",
    });

    setNotice("Announcement published successfully!");
  }

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (complaint) => complaint.status !== "RESOLVED"
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint) => complaint.status === "RESOLVED"
  ).length;

  // Show unresolved complaints requiring immediate review first,
  // then sort by severity score from highest to lowest.
  const sortedComplaints = [...complaints].sort((a, b) => {
    const aUnresolved = a.status !== "RESOLVED";
    const bUnresolved = b.status !== "RESOLVED";

    const aCritical =
      aUnresolved && a.immediateReview === true;
    const bCritical =
      bUnresolved && b.immediateReview === true;

    if (aCritical !== bCritical) {
      return Number(bCritical) - Number(aCritical);
    }

    const aScore = Number(a.severityScore) || 0;
    const bScore = Number(b.severityScore) || 0;

    if (aUnresolved !== bUnresolved) {
      return Number(bUnresolved) - Number(aUnresolved);
    }

    return bScore - aScore;
  });

  function getPriorityClass(priority) {
    switch (priority) {
      case "CRITICAL":
        return "critical";
      case "HIGH":
        return "high";
      case "MEDIUM":
        return "medium";
      case "LOW":
        return "low";
      default:
        return "unassessed";
    }
  }

  return (
    <div className="warden-page">
      <header className="warden-header">
        <div>
          <span className="warden-eyebrow">
            CAMPUSEASE · ADMINISTRATION
          </span>

          <h1>Warden Dashboard</h1>

          <p>
            Manage hostel complaints and communicate with students.
          </p>
        </div>

        <div className="warden-avatar">W</div>
      </header>

      <main className="warden-content">
        <section className="warden-stats">
          <article className="warden-stat">
            <span>Total Complaints</span>
            <strong>{totalComplaints}</strong>
          </article>

          <article className="warden-stat">
            <span>Pending Complaints</span>
            <strong>{pendingComplaints}</strong>
          </article>

          <article className="warden-stat">
            <span>Resolved Complaints</span>
            <strong>{resolvedComplaints}</strong>
          </article>
        </section>

        <nav className="warden-tabs">
          <button
            className={
              activeTab === "complaints" ? "active" : ""
            }
            onClick={() => {
              setActiveTab("complaints");
              setNotice("");
              refreshData();
            }}
          >
            📋 Manage Complaints
          </button>

          <button
            className={
              activeTab === "announcements" ? "active" : ""
            }
            onClick={() => {
              setActiveTab("announcements");
              setNotice("");
              refreshData();
            }}
          >
            📢 Announcements
          </button>

          <button
            onClick={() => {
              refreshData();
              setNotice("Data refreshed.");
            }}
          >
            🔄 Refresh Data
          </button>
        </nav>

        {notice && (
          <div className="warden-notice" role="status">
            {notice}
          </div>
        )}

        {activeTab === "complaints" && (
          <section className="warden-panel">
            <div className="warden-panel-heading">
              <div>
                <h2>Hostel Complaints</h2>
                <p>
                  Review complaint severity, priority and progress.
                </p>
              </div>

              <span className="warden-count">
                {totalComplaints} complaints
              </span>
            </div>

            {complaints.length === 0 ? (
              <p className="warden-empty">
                No complaints submitted yet.
              </p>
            ) : (
              <div className="warden-complaint-list">
                {sortedComplaints.map((complaint) => (
                  <article
                    className="warden-complaint"
                    key={complaint.id}
                  >
                    <div className="warden-complaint-heading">
                      <div>
                        <span className="warden-complaint-id">
                          {complaint.id}
                        </span>

                        <h3>{complaint.title}</h3>
                      </div>

                      <span
                        className={`warden-status ${String(
                          complaint.status
                        ).toLowerCase()}`}
                      >
                        {complaint.status.replace("_", " ")}
                      </span>
                    </div>

                    <p className="warden-description">
                      {complaint.description}
                    </p>

                    <div className="warden-metadata">
                      <span>
                        Category: {complaint.category}
                      </span>

                      <span>Room: {complaint.room}</span>

                      <span>Date: {complaint.date}</span>
                    </div>

                    <div className="warden-severity">
                      <h4>Severity Assessment</h4>

                      {complaint.severityScore !== undefined ? (
                        <>
                          <div className="warden-metadata">
                            <span>
                              Score: {complaint.severityScore}/40
                            </span>

                            <span>
                              Priority:{" "}
                              {complaint.priority || "UNASSESSED"}
                            </span>
                          </div>

                          <div className="warden-metadata">
                            <span>
                              Safety risk:{" "}
                              {complaint.safetyRisk ?? "Not recorded"}
                            </span>

                            <span>
                              Problem severity:{" "}
                              {complaint.severity ?? "Not recorded"}
                            </span>

                            <span>
                              People affected:{" "}
                              {complaint.impact ?? "Not recorded"}
                            </span>
                          </div>

                          <span
                            className={`warden-priority ${getPriorityClass(
                              complaint.priority
                            )}`}
                          >
                            {complaint.priority || "UNASSESSED"}
                          </span>
                        </>
                      ) : (
                        <p>
                          This is an older complaint or has not been
                          assessed using the new scoring system.
                        </p>
                      )}

                      {complaint.immediateReview && (
                        <div
                          className="warden-safety-alert"
                          role="alert"
                        >
                          ⚠️ Immediate safety review required.
                          Verify the reported risk urgently.
                        </div>
                      )}

                      <p className="warden-assessment-note">
                        Scores reflect the submitted assessment.
                        Verify the details before deciding on action.
                      </p>
                    </div>

                    <label className="warden-status-control">
                      Update Complaint Status

                      <select
                        value={complaint.status}
                        onChange={(event) =>
                          updateStatus(
                            complaint.id,
                            event.target.value
                          )
                        }
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </label>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "announcements" && (
          <section className="warden-panel">
            <h2>Publish Hostel Announcement</h2>

            <p className="warden-subtitle">
              Create notices for students to view in CampusEase.
            </p>

            <form
              className="warden-announcement-form"
              onSubmit={publishAnnouncement}
            >
              <label>
                Announcement Title

                <input
                  name="title"
                  value={announcementForm.title}
                  onChange={handleAnnouncementChange}
                  placeholder="e.g. Water Supply Maintenance"
                  maxLength={100}
                  required
                />
              </label>

              <label>
                Announcement Message

                <textarea
                  name="message"
                  value={announcementForm.message}
                  onChange={handleAnnouncementChange}
                  placeholder="Enter the announcement details..."
                  rows={4}
                  maxLength={1000}
                  required
                />
              </label>

              <button
                className="warden-publish-button"
                type="submit"
              >
                Publish Announcement →
              </button>
            </form>

            <div className="warden-published-list">
              <h3>Published Announcements</h3>

              {announcements.map((announcement) => (
                <article
                  className="warden-announcement"
                  key={announcement.id}
                >
                  <div className="warden-announcement-icon">
                    📢
                  </div>

                  <div>
                    <h4>{announcement.title}</h4>
                    <p>{announcement.message}</p>
                    <span>{announcement.date}</span>
                  </div>
                </article>
              ))}

              {announcements.length === 0 && (
                <p>No announcements published yet.</p>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default WardenDashboard;
