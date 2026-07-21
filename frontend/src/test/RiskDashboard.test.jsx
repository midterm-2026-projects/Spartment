import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";


import {
  describe,
  it,
  expect,
} from "vitest";


import RiskDashboard
from "../pages/RiskDashboard";





describe(
"RiskDashboard",
()=>{



it(
"should display risk monitoring page",
async()=>{


render(
<RiskDashboard />
);




await waitFor(()=>{


expect(

screen.getByText(
/Tenant Risk Monitoring/i
)

)
.toBeInTheDocument();



});



});





});