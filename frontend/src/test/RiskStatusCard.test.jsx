import {
render,
screen,
} from "@testing-library/react";


import {
describe,
it,
expect,
} from "vitest";


import RiskStatusCard
from "../components/RiskStatusCard";





describe(
"RiskStatusCard",
()=>{


it(
"should display high risk status",
()=>{


render(

<RiskStatusCard

risk={{

riskLevel:"High"

}}

/>

);




expect(

screen.getByText(
"High Risk"
)

)
.toBeInTheDocument();



});





});