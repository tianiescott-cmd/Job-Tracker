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
