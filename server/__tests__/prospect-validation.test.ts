import { validateProspect } from "../prospect-helpers";

describe("prospect creation validation", () => {
  test("rejects a blank company name", () => {
    const result = validateProspect({
      companyName: "",
      roleTitle: "Software Engineer",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Company name is required");
  });

  test("rejects a blank role title", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Role title is required");
  });
});

describe("salary validation", () => {
  test("accepts a valid salary", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      salary: 150000,
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts zero salary", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      salary: 0,
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts null salary (not provided)", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      salary: null,
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts undefined salary (omitted)", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("rejects a negative salary", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      salary: -50000,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Salary cannot be negative");
  });

  test("rejects a salary exceeding the maximum", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      salary: 20_000_000,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Salary cannot exceed 10,000,000");
  });

  test("rejects a non-integer salary", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      salary: 150000.50,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Salary must be a whole number");
  });

  test("rejects a string salary", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      salary: "150000" as unknown,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Salary must be a whole number");
  });
});

describe("deadline validation", () => {
  test("accepts a valid deadline date", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      deadline: "2025-06-15",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts a past deadline date", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      deadline: "2020-01-01",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts null deadline (cleared)", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      deadline: null,
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts undefined deadline (omitted)", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("rejects a deadline with wrong format", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      deadline: "06/15/2025",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Deadline must be in YYYY-MM-DD format");
  });

  test("rejects a non-string deadline", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      deadline: 20250615 as unknown,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Deadline must be a valid date string");
  });

  test("rejects an invalid date string in correct format", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      deadline: "2025-13-45",
    });

    expect(result.valid).toBe(false);
  });

  test("rejects Feb 29 on a non-leap year", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      deadline: "2025-02-29",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Deadline must be a valid date");
  });

  test("rejects April 31", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      deadline: "2025-04-31",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Deadline must be a valid date");
  });

  test("accepts Feb 29 on a leap year", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      deadline: "2024-02-29",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("allows creating a prospect with both deadline and salary", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      salary: 150000,
      deadline: "2025-07-01",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

describe("interview date validation", () => {
  test("accepts a valid interview date", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      interviewDate: "2025-08-15",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts a prospect without an interview date", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts null interview date (cleared)", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      interviewDate: null,
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("rejects an interview date with wrong format", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      interviewDate: "08/15/2025",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Interview date must be in YYYY-MM-DD format");
  });

  test("rejects a non-string interview date", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      interviewDate: 20250815 as unknown,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Interview date must be a valid date string");
  });

  test("rejects an invalid calendar interview date", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      interviewDate: "2025-02-29",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Interview date must be a valid date");
  });

  test("accepts a past interview date", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      interviewDate: "2024-01-10",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("allows a prospect with interview date, deadline, and salary together", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      salary: 200000,
      deadline: "2025-07-01",
      interviewDate: "2025-07-15",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("allows editing interview date to a new valid date", () => {
    const original = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      interviewDate: "2025-08-01",
    });
    expect(original.valid).toBe(true);

    const updated = validateProspect({
      companyName: "Google",
      roleTitle: "Software Engineer",
      interviewDate: "2025-09-15",
    });
    expect(updated.valid).toBe(true);
    expect(updated.errors).toHaveLength(0);
  });
});
