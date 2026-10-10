const COMPLAINTS_KEY = "campusease_hostel_complaints";
const ANNOUNCEMENTS_KEY = "campusease_hostel_announcements";

const initialAnnouncements = [
  {
    id: 1,
    title: "Hostel Maintenance Notice",
    message:
      "Please report electrical and plumbing issues through CampusEase.",
    date: "Today",
  },
  {
    id: 2,
    title: "Keep Your Hostel Clean",
    message:
      "Please keep your rooms and common areas clean.",
    date: "Today",
  },
];

function readData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);

    if (saved === null) {
      return fallback;
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function getComplaints() {
  return readData(COMPLAINTS_KEY, []);
}

export function saveComplaints(complaints) {
  localStorage.setItem(
    COMPLAINTS_KEY,
    JSON.stringify(complaints)
  );
}

export function getAnnouncements() {
  return readData(ANNOUNCEMENTS_KEY, initialAnnouncements);
}

export function saveAnnouncements(announcements) {
  localStorage.setItem(
    ANNOUNCEMENTS_KEY,
    JSON.stringify(announcements)
  );
}