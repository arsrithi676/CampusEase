import { useState } from "react";
import "./HostelPortalSelection.css";
import HostelServices from "./HostelServices";
import WardenDashboard from "./WardenDashboard";

const demoAccounts = {
  student: {
    id: "STU001",
    password: "student123",
  },
  warden: {
    id: "WARDEN001",
    password: "warden123",
  },
};

export default function HostelPortalSelection({ onBack }) {
  const [selectedRole, setSelectedRole] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedInRole, setLoggedInRole] = useState("");

  function handleLogin(event) {
    event.preventDefault();

    const account = demoAccounts[selectedRole];

    if (
      account &&
      userId.trim() === account.id &&
      password === account.password
    ) {
      setError("");
      setLoggedInRole(selectedRole);
    } else {
      setError("Invalid ID or password. Please try again.");
    }
  }

  if (loggedInRole === "student") {
    return <HostelServices />;
  }

  if (loggedInRole === "warden") {
    return <WardenDashboard />;
  }

  return (
    <div className="portal-page">
      <button className="portal-back" onClick={onBack}>
        ← Back to CampusEase
      </button>

      <header className="portal-header">
        <div className="portal-logo">CE</div>
        <h1>Hostel Services</h1>
        <p>Your hostel, made easier.</p>
      </header>

      {!selectedRole ? (
        <div className="portal-options">
          <button
            className="portal-card student-card"
            onClick={() => setSelectedRole("student")}
          >
            <span className="portal-icon">🎓</span>
            <h2>Student Portal</h2>
            <p>Submit complaints, track requests and view announcements.</p>
            <span className="portal-action">Continue as Student →</span>
          </button>

          <button
            className="portal-card warden-card"
            onClick={() => setSelectedRole("warden")}
          >
            <span className="portal-icon">🛡️</span>
            <h2>Warden Portal</h2>
            <p>Manage hostel complaints and publish announcements.</p>
            <span className="portal-action">Continue as Warden →</span>
          </button>
        </div>
      ) : (
        <form className="portal-login" onSubmit={handleLogin}>
          <h2>
            {selectedRole === "student" ? "Student Login" : "Warden Login"}
          </h2>

          <p className="portal-demo-note">
            Demo mode — temporary credentials only
          </p>

          <label htmlFor="portal-user-id">User ID</label>
          <input
            id="portal-user-id"
            type="text"
            placeholder="Enter your ID"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            required
          />

          <label htmlFor="portal-password">Password</label>
          <input
            id="portal-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p className="portal-error">{error}</p>}

          <button className="portal-login-button" type="submit">
            Sign In
          </button>

          <button
            className="portal-switch"
            type="button"
            onClick={() => {
              setSelectedRole("");
              setUserId("");
              setPassword("");
              setError("");
            }}
          >
            ← Choose another portal
          </button>

          <div className="portal-credentials">
            <strong>Demo credentials</strong>
            <p>
              ID: {demoAccounts[selectedRole].id}
            </p>
            <p>
              Password: {demoAccounts[selectedRole].password}
            </p>
          </div>
        </form>
      )}

      <footer className="portal-footer">
        CampusEase · Genesis'26
      </footer>
    </div>
  );
}