import {
render,
screen,
} from "@testing-library/react";


import {
describe,
it,
expect,
} from "vitest";


import RiskIndicatorList
from "../components/RiskIndicatorList";




describe(
"RiskIndicatorList",
()=>{


it(
"should display risk indicators",
()=>{


render(

<RiskIndicatorList

indicators={[

"Repeated late payments",

"Outstanding unpaid balance"

]}

/>

);




expect(

screen.getByText(
"Repeated late payments"
)

)
.toBeInTheDocument();




expect(

screen.getByText(
"Outstanding unpaid balance"
)

)
.toBeInTheDocument();



});




});