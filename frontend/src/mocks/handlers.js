import { http, HttpResponse } from "msw";

export const handlers = [
  /*
==========================================
BILLING API
==========================================
*/

  http.get("http://localhost:5000/api/billing", () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 1,
          tenantId: 1,
          rentAmount: 5000,
          waterBill: 200,
          electricityBill: 850,
          totalAmount: 6050,
          status: "Pending",
          dueDate: "2026-07-30",
        },
      ],
    });
  }),

  http.get("http://localhost:5000/api/billing/tenant/:tenantId", () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: 1,
        tenantId: 1,
        rentAmount: 5000,
        waterBill: 200,
        electricityBill: 850,
        totalAmount: 6050,
        status: "Pending",
        dueDate: "2026-07-30",
        payments: [
          {
            id: 1,
            amount: 6050,
            paymentMethod: "Cash",
            status: "Paid",
            paymentDate: "2026-07-20",
          },
        ],
      },
    });
  }),

  http.post(
    "http://localhost:5000/api/billing/generate",
    async ({ request }) => {
      const body = await request.json();

      return HttpResponse.json({
        success: true,
        message: "Billing generated successfully.",
        data: {
          id: 1,
          tenantId: body.tenantId,
          billingType: body.billingType || "initial",
          rentAmount: 5000,
          waterBill: 200,
          electricityBill: 0,
          totalAmount: 5200,
          status: "Pending",
        },
      });
    },
  ),

  http.patch(
    "http://localhost:5000/api/billing/:billingId/status",
    async ({ request }) => {
      const body = await request.json();

      return HttpResponse.json({
        success: true,
        message: "Billing status updated successfully.",
        data: {
          id: 1,
          status: body.status,
        },
      });
    },
  ),

  /*
==========================================
PAYMENT API
==========================================
*/

  http.patch(
    "http://localhost:5000/api/payment/:id/confirm",
    async ({ request }) => {
      const body = await request.json();

      return HttpResponse.json({
        message: "Payment confirmed successfully.",
        data: {
          id: 1,
          amount: 6050,
          paymentMethod: body.paymentMethod || "Cash",
          status: "Paid",
          paymentDate: "2026-07-20",
        },
      });
    },
  ),

  http.get("http://localhost:5000/api/payment/tenant/:tenantId", () => {
    return HttpResponse.json({
      message: "Payment history retrieved successfully.",
      data: [
        {
          id: 1,
          amount: 6050,
          paymentMethod: "Cash",
          status: "Paid",
          paymentDate: "2026-07-20",
        },
      ],
    });
  }),

  http.get("http://localhost:5000/api/payment/metrics", () => {
    return HttpResponse.json({
      data: {
        collectedRevenue: 50000,
        pendingPayments: 5,
        latePayments: 2,
      },
    });
  }),

  /*
==========================================
ANALYTICS API
==========================================
*/

  http.get("http://localhost:5000/analytics", () => {
    return HttpResponse.json({
      totalRevenue: 80000,

      totalTenants: 32,

      occupancyRate: 95,

      paymentStatus: {
        paid: 20,
        pending: 5,
        overdue: 2,
      },

      revenueTrend: [
        {
          month: "January",
          amount: 50000,
        },

        {
          month: "February",
          amount: 60000,
        },
      ],

      recommendations: [
        {
          title: "Overdue Payments",
          message: "2 tenants have overdue balances.",
        },
      ],
    });
  }),

  /*
==========================================
ROOM API
==========================================
*/

  http.get("http://localhost:5000/api/rooms", () => {
    return HttpResponse.json([
      {
        roomId: 1,
        roomNumber: "101",
        status: "Vacant",
        price: 5000,
      },

      {
        roomId: 2,
        roomNumber: "102",
        status: "Occupied",
        price: 5000,
      },

      {
        roomId: 3,
        roomNumber: "103",
        status: "Reserved",
        price: 5000,
      },
    ]);
  }),

  http.get("http://localhost:5000/api/rooms/available", () => {
    return HttpResponse.json([
      {
        roomId: 1,
        roomNumber: "101",
        status: "Vacant",
        price: 5000,
      },
    ]);
  }),

  /*
==========================================
INQUIRY API
==========================================
*/

  http.post("http://localhost:5000/api/inquiries", async ({ request }) => {
    const body = await request.json();

    return HttpResponse.json({
      message: "Inquiry submitted successfully.",

      inquiry: {
        id: 1,

        ...body,

        status: "Pending",
      },
    });
  }),

  http.get("http://localhost:5000/api/inquiries", () => {
    return HttpResponse.json([
      {
        id: 1,
        guestName: "Juan Dela Cruz",
        email: "juan@gmail.com",
        contact: "09123456789",
        requestedRoom: "101",
        message: "Interested in renting this room.",
        status: "Pending",
      },
    ]);
  }),

  /*
==========================================
CUSTOMER REQUEST API
==========================================
*/

  http.get("http://localhost:5000/api/customer-requests", () => {
    return HttpResponse.json([
      {
        id: 1,
        guestName: "Juan Dela Cruz",
        email: "juan@gmail.com",
        contact: "09123456789",
        requestedRoom: "101",
        message: "Interested in renting this room.",
        status: "Pending",
      },
    ]);
  }),

  http.put("http://localhost:5000/api/customer-requests/:id/approve", () => {
    return HttpResponse.json({
      message: "Request approved successfully.",

      status: "Approved",
    });
  }),

  http.put("http://localhost:5000/api/customer-requests/:id/reject", () => {
    return HttpResponse.json({
      message: "Request rejected successfully.",

      status: "Rejected",
    });
  }),

  /*
==========================================
TENANT CREATION API
==========================================
*/

  http.post("http://localhost:5000/api/tenants", async ({ request }) => {
    const body = await request.json();

    return HttpResponse.json({
      message: "Tenant created successfully.",

      data: {
        tenant: {
          id: 1,

          fullName: body.fullName,

          email: body.email,

          contact: body.contact,

          room: body.room,

          username: body.username,

          password: "Tenant123",

          status: "Active",
        },

        billing: {
          id: 1,

          tenantId: 1,

          billingType: "initial",

          rentAmount: 5000,

          waterBill: 200,

          electricityBill: 0,

          totalAmount: 5200,

          status: "Pending",
        },
      },
    });
  }),

  /*
==========================================
PAYMENT API
==========================================
*/

  http.patch("http://localhost:5000/api/payment/:id/confirm", () => {
    return HttpResponse.json({
      message: "Payment confirmed successfully.",

      data: {
        id: 1,

        amount: 6050,

        paymentMethod: "Cash",

        status: "Paid",
      },
    });
  }),

  http.get("http://localhost:5000/api/payment/tenant/:id", () => {
    return HttpResponse.json({
      data: [
        {
          date: "2026-07-20",

          amount: 5000,

          method: "Cash",

          status: "Paid",
        },

        {
          date: "2026-06-20",

          amount: 5000,

          method: "Cash",

          status: "Paid",
        },
      ],
    });
  }),

  http.get("http://localhost:5000/api/payment/metrics", () => {
    return HttpResponse.json({
      data: {
        collectedRevenue: 50000,

        pendingPayments: 5,

        latePayments: 2,
      },
    });
  }),

  /*
==========================================
TENANT INFORMATION API
==========================================
GET /api/tenant/:tenantId
==========================================
*/

  http.get("http://localhost:5000/api/tenant/:tenantId", ({ params }) => {
    return HttpResponse.json({
      tenant: {
        id: Number(params.tenantId),

        name: "Juan Dela Cruz",

        contact: "09123456789",

        email: "juan@email.com",
      },

      room: {
        roomNumber: "101",

        monthlyRent: 5000,

        nextDue: "2026-07-30",
      },

      payments: [
        {
          id: 1,

          paymentDate: "2026-07-20",

          amount: 5000,

          paymentMethod: "Cash",

          status: "Paid",
        },

        {
          id: 2,

          paymentDate: "2026-06-20",

          amount: 5000,

          paymentMethod: "Cash",

          status: "Paid",
        },
      ],
    });
  }),

  /*
==========================================
RISK ANALYSIS API
==========================================
*/

  /*
GET Tenant Risk Analysis

Backend:
GET /api/risk/tenant/:tenantId

*/

  http.get("http://localhost:5000/api/risk/tenant/:tenantId", ({ params }) => {
    return HttpResponse.json({
      success: true,

      data: {
        tenantId: Number(params.tenantId),

        riskLevel: "High",

        latePayments: 3,

        unpaidBalance: 5000,

        indicators: [
          "Repeated late payments detected.",

          "Outstanding unpaid balance.",

          "Payment delays exceeded allowed limit.",
        ],

        analyzedAt: "2026-07-20",
      },
    });
  }),

  /*
GET High Risk Tenants

Backend:
GET /api/risk/high-risk

*/

  http.get("http://localhost:5000/api/risk/high-risk", () => {
    return HttpResponse.json({
      success: true,

      data: [
        {
          id: 1,

          tenantId: 1,

          tenantName: "Juan Dela Cruz",

          riskLevel: "High",

          latePayments: 3,

          unpaidBalance: 5000,

          indicators: ["Repeated late payments", "Outstanding balance"],
        },

        {
          id: 2,

          tenantId: 2,

          tenantName: "Maria Santos",

          riskLevel: "Medium",

          latePayments: 1,

          unpaidBalance: 2000,

          indicators: ["One late payment detected"],
        },
      ],
    });
  }),
];
