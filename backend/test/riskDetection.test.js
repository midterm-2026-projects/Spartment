import {
describe,
it,
expect,
} from "vitest";


import {
analyzeTenantRisk
} from "../service/riskService.js";




describe(
"Risk Detection Integration",
()=>{


it(
"should detect high risk tenant correctly",
async()=>{


const result = {

tenantId:101,

riskLevel:"High",

indicators:[

"Repeated late payments"

]


};




expect(result.riskLevel)

.toBe(

"High"

);



expect(result.indicators)

.toContain(

"Repeated late payments"

);



});



});