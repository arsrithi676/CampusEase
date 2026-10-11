import { useState } from "react";
import StaffLogin from "./StaffLogin";
import StaffDashboard from "./staffDashboard";
import "./store.css";

export default function StorePage() {
  const [isStaff, setIsStaff] = useState(null);

  // Show staff login
  if (isStaff === "login") {
    return (
      <div>
        <button
          type="button"
          onClick={() => setIsStaff(null)}
          className="store-back-button"
        >
          ← Back to Store
        </button>

        <StaffLogin
          onLogin={() => setIsStaff("dashboard")}
        />
      </div>
    );
  }

  // Show staff dashboard after successful demo login
  if (isStaff === "dashboard") {
    return (
      <div>
        <button
          type="button"
          onClick={() => setIsStaff(null)}
          className="store-back-button"
        >
          ← Back to Store
        </button>

        <StaffDashboard />
      </div>
    );
  }

  // Store landing page
  return (
    <div className="store-page">
      <header className="store-header">
        <h1>Campus Store</h1>
        <p>Your campus shopping destination</p>

        <div className="store-staff-access">
          <button
            type="button"
            onClick={() => setIsStaff("login")}
          >
            Staff Login
          </button>
        </div>
      </header>

      <main className="store-main">
        <h2>Welcome to Campus Store</h2>
        <p>
          Access the staff portal to manage store inventory
          and orders.
        </p>

        <button
          type="button"
          onClick={() => setIsStaff("login")}
        >
          Open Staff Login
        </button>
      </main>
    </div>
  );
}