
export function calculateComplaintSeverity({
  safetyRisk,
  severity,
  impact,
  immediateDanger = false,
}) {
  // Validate the assessment values.
  if (
    !Number.isInteger(safetyRisk) ||
    safetyRisk < 0 ||
    safetyRisk > 5 ||
    !Number.isInteger(severity) ||
    severity < 1 ||
    severity > 5 ||
    !Number.isInteger(impact) ||
    impact < 1 ||
    impact > 5
  ) {
    throw new Error("Invalid complaint severity assessment.");
  }

  // An immediate safety risk requires urgent review.
  if (immediateDanger) {
    return {
      score: 40,
      priority: "CRITICAL",
      immediateReview: true,
    };
  }

  // Rule-based severity score: maximum 40.
  const score =
    4 * safetyRisk +
    2 * severity +
    2 * impact;

  let priority;

  if (score >= 28) {
    priority = "HIGH";
  } else if (score >= 16) {
    priority = "MEDIUM";
  } else {
    priority = "LOW";
  }

  return {
    score,
    priority,
    immediateReview: false,
  };
}
