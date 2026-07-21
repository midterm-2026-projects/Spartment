import {
render,
screen,
} from "@testing-library/react";


import {
describe,
it,
expect,
} from "vitest";


import HighRiskTenantTable
from "../components/HighRiskTenantTable";





describe(
"HighRiskTenantTable",
()=>{


it(
"should display high risk tenants",
()=>{


render(

<HighRiskTenantTable

tenants={[

{

tenantId:1,

riskLevel:"High",

latePayments:3,

unpaidBalance:5000

}

]}

/>

);




expect(

screen.getByText(
"High Risk Tenants"
)

)
.toBeInTheDocument();




expect(

screen.getByText(
"High"
)

)
.toBeInTheDocument();



});



});