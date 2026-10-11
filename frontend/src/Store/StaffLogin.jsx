import { useState } from "react";
import "./store.css";

export default function StaffLogin({ onLogin }) {
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Temporary demo credentials
  const DEFAULT_STAFF_ID = "STAFF001";
  const DEFAULT_PASSWORD = "Store@123";

  function handleLogin(e) {
    e.preventDefault();

    if (
      staffId.trim() === DEFAULT_STAFF_ID &&
      password === DEFAULT_PASSWORD
    ) {
      setError("");
      onLogin();
    } else {
      setError("Invalid Staff ID or password.");
    }
  }

  return (
    <div className="staff-login">
      <form className="staff-login-card" onSubmit={handleLogin}>
        <h2>Staff Login</h2>
        <p>Sign in to manage store inventory and orders.</p>

        <label htmlFor="staffId">Staff ID</label>
        <input
          id="staffId"
          type="text"
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          placeholder="Enter Staff ID"
          required
        />

        <label htmlFor="staffPassword">Password</label>
        <input
          id="staffPassword"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
        />

        {error && (
          <p className="staff-login-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}