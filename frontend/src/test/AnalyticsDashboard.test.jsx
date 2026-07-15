import {
  describe,
  expect,
  it,
} from "vitest";


import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";


import AnalyticsDashboard
from "../pages/AnalyticsDashboard";


describe(
  "Analytics Dashboard",
  () => {


    it(
      "should display analytics data successfully",
      async () => {


        render(
          <AnalyticsDashboard />
        );


        await waitFor(() => {

          expect(
            screen.getByText(
              "Analytics Dashboard"
            )
          )
          .toBeInTheDocument();


          expect(
            screen.getByText(
              "₱80000"
            )
          )
          .toBeInTheDocument();


          expect(
            screen.getByText(
              "95%"
            )
          )
          .toBeInTheDocument();

        });


      }
    );



    it(
      "should display payment status correctly",
      async () => {


        render(
          <AnalyticsDashboard />
        );


        await waitFor(() => {

          expect(
            screen.getByText(
              "Paid: 20"
            )
          )
          .toBeInTheDocument();


          expect(
            screen.getByText(
              "Pending: 5"
            )
          )
          .toBeInTheDocument();


          expect(
            screen.getByText(
              "Overdue: 2"
            )
          )
          .toBeInTheDocument();

        });


      }
    );



  }
);