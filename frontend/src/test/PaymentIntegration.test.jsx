import {
  describe,
  it,
  expect,
} from "vitest";


import {
  http,
  HttpResponse,
} from "msw";


import {
  server,
} from "../mocks/server.js";


import {
  confirmPayment,
  getPaymentHistory,
  getPaymentMetrics,
} from "../api/paymentApi.js";



describe(
  "Payment Integration",
  () => {



    it(
      "should confirm tenant cash payment successfully",
      async () => {


        const result =
          await confirmPayment(

            1,

            {
              paymentMethod:
                "Cash"
            }

          );




        expect(

          result.data.status

        )
        .toBe(
          "Paid"
        );




        expect(

          result.data.paymentMethod

        )
        .toBe(
          "Cash"
        );



      }

    );








    it(
      "should retrieve tenant payment history successfully",
      async () => {



        const result =
          await getPaymentHistory(
            1
          );




        expect(

          result.data

        )
        .toHaveLength(
          1
        );




        expect(

          result.data[0].amount

        )
        .toBe(
          6050
        );




        expect(

          result.data[0].status

        )
        .toBe(
          "Paid"
        );



      }

    );








    it(
      "should retrieve revenue metrics successfully",
      async () => {



        const result =
          await getPaymentMetrics();




        expect(

          result.data.collectedRevenue

        )
        .toBe(
          50000
        );




        expect(

          result.data.pendingPayments

        )
        .toBe(
          5
        );




        expect(

          result.data.latePayments

        )
        .toBe(
          2
        );



      }

    );








    it(
      "should handle payment confirmation failure",
      async () => {



        server.use(


          http.patch(

            "http://localhost:5000/api/payment/:id/confirm",

            () => {


              return HttpResponse.error();


            }

          )


        );





        await expect(

          confirmPayment(

            1,

            {
              paymentMethod:
                "Cash"
            }

          )

        )
        .rejects
        .toThrow();



      }

    );




  }

);