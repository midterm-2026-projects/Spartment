import {
  http,
  HttpResponse,
} from "msw";


export const handlers = [

  http.get(
    "http://localhost:5000/analytics",
    () => {

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
            title:
              "Overdue Payments",

            message:
              "2 tenants have overdue balances.",
          },
        ],

      });

    }
  ),

];