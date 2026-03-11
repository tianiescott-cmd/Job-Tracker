import { STATUSES, INTEREST_LEVELS, MAX_SALARY } from "@shared/schema";

export function getNextStatus(currentStatus: string): string {
  const terminalStatuses = ["Offer", "Rejected", "Withdrawn"];
  if (terminalStatuses.includes(currentStatus)) {
    return currentStatus;
  }
  const index = STATUSES.indexOf(currentStatus as (typeof STATUSES)[number]);
  if (index === -1 || index >= STATUSES.length - 1) {
    return currentStatus;
  }
  const next = STATUSES[index + 1];
  if (next === "Rejected" || next === "Withdrawn") {
    return currentStatus;
  }
  return next;
}

export function validateProspect(data: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.companyName || typeof data.companyName !== "string" || data.companyName.trim() === "") {
    errors.push("Company name is required");
  }

  if (!data.roleTitle || typeof data.roleTitle !== "string" || data.roleTitle.trim() === "") {
    errors.push("Role title is required");
  }

  if (data.status !== undefined) {
    if (!STATUSES.includes(data.status as (typeof STATUSES)[number])) {
      errors.push(`Status must be one of: ${STATUSES.join(", ")}`);
    }
  }

  if (data.interestLevel !== undefined) {
    if (!INTEREST_LEVELS.includes(data.interestLevel as (typeof INTEREST_LEVELS)[number])) {
      errors.push(`Interest level must be one of: ${INTEREST_LEVELS.join(", ")}`);
    }
  }

  if (data.deadline !== undefined && data.deadline !== null) {
    if (typeof data.deadline !== "string") {
      errors.push("Deadline must be a valid date string");
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(data.deadline)) {
      errors.push("Deadline must be in YYYY-MM-DD format");
    } else {
      const [y, m, d] = data.deadline.split("-").map(Number);
      const dt = new Date(Date.UTC(y, m - 1, d));
      if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) {
        errors.push("Deadline must be a valid date");
      }
    }
  }

  if (data.salary !== undefined && data.salary !== null) {
    if (typeof data.salary !== "number" || !Number.isInteger(data.salary)) {
      errors.push("Salary must be a whole number");
    } else if (data.salary < 0) {
      errors.push("Salary cannot be negative");
    } else if (data.salary > MAX_SALARY) {
      errors.push(`Salary cannot exceed ${MAX_SALARY.toLocaleString()}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function isTerminalStatus(status: string): boolean {
  return status === "Rejected" || status === "Withdrawn" || status === "Offer";
}
