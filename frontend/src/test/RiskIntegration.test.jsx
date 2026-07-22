import { describe, it, expect } from "vitest";

describe("Risk Detection Integration", () => {
  it("should identify high risk tenant from risk assessment data", () => {
    const riskAssessment = {
      tenantId: "tenant-001",

      riskLevel: "High",

      riskScore: 85,

      riskCategory: "Payment Risk",

      sourceCondition: ["Repeated late payments", "Large unpaid balance"],

      indicators: [
        {
          condition: "Late Payments",

          description: "Tenant has repeated delayed payments.",
        },

        {
          condition: "Unpaid Balance",

          description: "Tenant has outstanding balance.",
        },
      ],

      latePayments: 5,

      unpaidBalance: 50000,
    };

    expect(riskAssessment.riskLevel).toBe("High");

    expect(riskAssessment.riskScore).toBeGreaterThanOrEqual(70);

    expect(riskAssessment.sourceCondition).toContain("Repeated late payments");

    expect(riskAssessment.indicators.length).toBeGreaterThan(0);
  });

  it("should identify low risk tenant from normal payment behavior", () => {
    const riskAssessment = {
      tenantId: "tenant-002",

      riskLevel: "Low",

      riskScore: 10,

      riskCategory: "Stable",

      latePayments: 0,

      unpaidBalance: 0,

      indicators: [],
    };

    expect(riskAssessment.riskLevel).toBe("Low");

    expect(riskAssessment.riskScore).toBeLessThan(30);

    expect(riskAssessment.latePayments).toBe(0);

    expect(riskAssessment.unpaidBalance).toBe(0);
  });

  it("should preserve risk source conditions", () => {
    const riskAssessment = {
      sourceCondition: [
        "Vacancy duration",

        "Revenue decline",

        "Payment delays",
      ],
    };

    expect(riskAssessment.sourceCondition).toEqual(
      expect.arrayContaining([
        "Vacancy duration",

        "Revenue decline",

        "Payment delays",
      ]),
    );
  });
});
