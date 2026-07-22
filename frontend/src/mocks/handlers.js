import { http, HttpResponse } from "msw";

export const handlers = [
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
BILLING API
==========================================
*/

  /*
GET ALL BILLING

GET /api/billing
*/

  http.get("http://localhost:5000/api/billing", () => {
    return HttpResponse.json({
      success: true,

      data: [
        {
          id: 1,

          tenant_id: 1,

          tenantId: 1,

          room_id: 101,

          roomId: 101,

          rentAmount: 5000,

          rent_amount: 5000,

          waterBill: 200,

          water_bill: 200,

          electricityBill: 850,

          electricity_bill: 850,

          totalAmount: 6050,

          total_amount: 6050,

          status: "Unpaid",

          dueDate: "2026-07-30",

          due_date: "2026-07-30",
        },
      ],
    });
  }),

  /*
GET TENANT BILLING

GET /api/billing/tenant/:tenantId

*/

  http.get(
    "http://localhost:5000/api/billing/tenant/:tenantId",

    ({ params }) => {
      return HttpResponse.json({
        success: true,

        data: {
          id: 1,

          tenant_id: Number(params.tenantId),

          tenantId: Number(params.tenantId),

          room_id: 101,

          roomId: 101,

          rentAmount: 5000,

          rent_amount: 5000,

          waterBill: 200,

          water_bill: 200,

          electricityBill: 850,

          electricity_bill: 850,

          totalAmount: 6050,

          total_amount: 6050,

          status: "Unpaid",

          dueDate: "2026-07-30",

          payments: [
            {
              id: 1,

              amount: 6050,

              paymentDate: "2026-07-20",

              payment_date: "2026-07-20",

              paymentMethod: "Cash",

              payment_method: "Cash",

              status: "Pending",

              payment_status: "Pending",
            },
          ],
        },
      });
    },
  ),

  /*
GENERATE BILLING

POST /api/billing/generate

*/

  http.post(
    "http://localhost:5000/api/billing/generate",

    async ({ request }) => {
      const body = await request.json();

      return HttpResponse.json({
        success: true,

        message: "Billing created successfully.",

        data: {
          id: 2,

          tenantId: body.tenantId,

          totalAmount: 6050,

          total_amount: 6050,

          status: "Unpaid",
        },
      });
    },
  ),

  /*
UPDATE BILLING STATUS

PATCH /api/billing/:id/status

*/

  http.patch(
    "http://localhost:5000/api/billing/:id/status",

    async ({ request, params }) => {
      const body = await request.json();

      return HttpResponse.json({
        success: true,

        data: {
          id: Number(params.id),

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

  /*
CREATE PAYMENT

POST /api/payment

*/

  http.post(
    "http://localhost:5000/api/payment",

    async ({ request }) => {
      const body = await request.json();

      return HttpResponse.json({
        success: true,

        message: "Payment submitted successfully.",

        data: {
          id: 1,

          billingId: body.billingId,

          tenantId: body.tenantId,

          amount: body.amount,

          paymentMethod: body.paymentMethod ?? "Cash",

          payment_method: body.paymentMethod ?? "Cash",

          status: "Pending",

          payment_status: "Pending",

          verification_status: "Pending",
        },
      });
    },
  ),

  /*
VERIFY PAYMENT

PATCH /api/payment/:id/verify

*/

  http.patch(
    "http://localhost:5000/api/payment/:id/verify",

    ({ params }) => {
      return HttpResponse.json({
        success: true,

        message: "Payment verified successfully.",

        data: {
          id: Number(params.id),

          status: "Paid",

          payment_status: "Paid",

          verification_status: "Verified",

          payment_method: "Cash",
        },
      });
    },
  ),

  /*
REJECT PAYMENT

PATCH /api/payment/:id/reject

*/

  http.patch(
    "http://localhost:5000/api/payment/:id/reject",

    ({ params }) => {
      return HttpResponse.json({
        success: true,

        message: "Payment rejected successfully.",

        data: {
          id: Number(params.id),

          status: "Rejected",

          payment_status: "Rejected",

          verification_status: "Rejected",
        },
      });
    },
  ),

  /*
GET TENANT PAYMENT HISTORY

GET /api/payment/tenant/:tenantId

*/

  http.get(
    "http://localhost:5000/api/payment/tenant/:tenantId",

    ({ params }) => {
      return HttpResponse.json({
        success: true,

        data: [
          {
            id: 1,

            tenant_id: Number(params.tenantId),

            tenantId: Number(params.tenantId),

            amount: 6050,

            payment_date: "2026-07-20",

            paymentDate: "2026-07-20",

            payment_method: "Cash",

            paymentMethod: "Cash",

            status: "Paid",

            payment_status: "Paid",
          },
        ],
      });
    },
  ),

  /*
PAYMENT METRICS

GET /api/payment/metrics

*/

  http.get(
    "http://localhost:5000/api/payment/metrics",

    () => {
      return HttpResponse.json({
        success: true,

        data: {
          collectedRevenue: 50000,

          pendingPayments: 5,

          latePayments: 2,
        },
      });
    },
  ),

  /*
==========================================
DASHBOARD METRICS API
==========================================
*/

  http.get(
    "http://localhost:5000/api/dashboard/metrics",

    () => {
      return HttpResponse.json({
        success: true,

        data: {
          collectedRevenue: 50000,

          pendingPayments: 5,

          latePayments: 2,

          totalBilling: 80000,

          outstandingBalance: 30000,

          paymentRate: 85,

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
        },
      });
    },
  ),

  /*
==========================================
RISK ANALYSIS API
==========================================
*/

  /*
GET TENANT RISK

GET /api/risk/tenant/:tenantId

*/

  http.get(
    "http://localhost:5000/api/risk/tenant/:tenantId",

    ({ params }) => {
      return HttpResponse.json({
        success: true,

        data: {
          tenantId: Number(params.tenantId),

          riskLevel: "High",

          score: 85,

          latePayments: 3,

          unpaidBalance: 5000,

          indicators: [
            "Repeated late payments detected.",

            "Outstanding unpaid balance.",

            "Payment delays exceeded limit.",
          ],

          analyzedAt: "2026-07-20",
        },
      });
    },
  ),

  /*
GET HIGH RISK TENANTS

GET /api/risk/high-risk

*/

  http.get(
    "http://localhost:5000/api/risk/high-risk",

    () => {
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

            indicators: ["Late payment detected"],
          },
        ],
      });
    },
  ),

  /*
==========================================
TENANT API
==========================================
*/

  /*
GET TENANT INFORMATION

GET /api/tenant/:tenantId

*/

  http.get(
    "http://localhost:5000/api/tenant/:tenantId",

    ({ params }) => {
      return HttpResponse.json({
        success: true,

        data: {
          tenant: {
            id: Number(params.tenantId),

            fullName: "Juan Dela Cruz",

            email: "juan@gmail.com",

            contact: "09123456789",
          },

          room: {
            roomNumber: "101",

            monthlyRent: 5000,

            nextDue: "2026-07-30",
          },

          payments: [
            {
              id: 1,

              amount: 5000,

              paymentMethod: "Cash",

              payment_method: "Cash",

              status: "Paid",

              paymentDate: "2026-07-20",

              payment_date: "2026-07-20",
            },
          ],
        },
      });
    },
  ),

  /*
CREATE TENANT

POST /api/tenants

*/

  http.post(
    "http://localhost:5000/api/tenants",

    async ({ request }) => {
      const body = await request.json();

      return HttpResponse.json({
        success: true,

        message: "Tenant created successfully.",

        data: {
          tenant: {
            id: 1,

            fullName: body.fullName,

            email: body.email,

            contact: body.contact,

            status: "Active",
          },

          billing: {
            id: 1,

            tenantId: 1,

            billingType: "Rent",

            totalAmount: 6050,

            status: "Unpaid",
          },
        },
      });
    },
  ),

  /*
==========================================
ROOM API
==========================================
*/

  /*
GET ALL ROOMS

GET /api/rooms

*/

  http.get(
    "http://localhost:5000/api/rooms",

    () => {
      return HttpResponse.json({
        success: true,

        data: [
          {
            id: 1,

            roomNumber: "101",

            status: "Available",

            monthlyRent: 5000,
          },

          {
            id: 2,

            roomNumber: "102",

            status: "Occupied",

            monthlyRent: 5000,
          },
        ],
      });
    },
  ),

  /*
GET AVAILABLE ROOMS

GET /api/rooms/available

*/

  http.get(
    "http://localhost:5000/api/rooms/available",

    () => {
      return HttpResponse.json({
        success: true,

        data: [
          {
            id: 1,

            roomNumber: "101",

            status: "Available",

            monthlyRent: 5000,
          },
        ],
      });
    },
  ),

  /*
==========================================
INQUIRY API
==========================================
*/

  /*
GET INQUIRIES

GET /api/inquiries

*/

  http.get(
    "http://localhost:5000/api/inquiries",

    () => {
      return HttpResponse.json({
        success: true,

        data: [
          {
            id: 1,

            guestName: "Juan Dela Cruz",

            email: "juan@gmail.com",

            contact: "09123456789",

            requestedRoom: "101",

            status: "Pending",
          },
        ],
      });
    },
  ),

  /*
CREATE INQUIRY

POST /api/inquiries

*/

  http.post(
    "http://localhost:5000/api/inquiries",

    async ({ request }) => {
      const body = await request.json();

      return HttpResponse.json({
        success: true,

        message: "Inquiry submitted successfully.",

        data: {
          id: 1,

          ...body,

          status: "Pending",
        },
      });
    },
  ),

  /*
==========================================
CUSTOMER REQUEST API
==========================================
*/

  /*
GET CUSTOMER REQUESTS

GET /api/customer-requests

*/

  http.get(
    "http://localhost:5000/api/customer-requests",

    () => {
      return HttpResponse.json({
        success: true,

        data: [
          {
            id: 1,

            guestName: "Juan Dela Cruz",

            requestedRoom: "101",

            status: "Pending",
          },
        ],
      });
    },
  ),

  /*
APPROVE REQUEST

PUT /api/customer-requests/:id/approve

*/

  http.put(
    "http://localhost:5000/api/customer-requests/:id/approve",

    ({ params }) => {
      return HttpResponse.json({
        success: true,

        message: "Request approved successfully.",

        data: {
          id: Number(params.id),

          status: "Approved",
        },
      });
    },
  ),

  /*
REJECT REQUEST

PUT /api/customer-requests/:id/reject

*/

  http.put(
    "http://localhost:5000/api/customer-requests/:id/reject",

    ({ params }) => {
      return HttpResponse.json({
        success: true,

        message: "Request rejected successfully.",

        data: {
          id: Number(params.id),

          status: "Rejected",
        },
      });
    },
  ),
];
