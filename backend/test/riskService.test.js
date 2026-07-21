import {
describe,
it,
expect,
vi,
beforeEach,
} from "vitest";



vi.mock(
"../model/paymentModel.js",
()=>({

getPaymentsByTenant:
vi.fn(),

})

);



vi.mock(
"../model/riskModel.js",
()=>({

createRiskRecord:
vi.fn(),

getHighRiskRecords:
vi.fn(),

})

);





import {

analyzeTenantRisk,

getHighRiskTenants

}

from "../service/riskService.js";



import {

getPaymentsByTenant

}

from "../model/paymentModel.js";



import {

createRiskRecord,

getHighRiskRecords

}

from "../model/riskModel.js";








describe(
"Risk Service",
()=>{


beforeEach(()=>{

vi.clearAllMocks();

});








it(
"should detect high-risk tenant with repeated late payments",
async()=>{


// Arrange

getPaymentsByTenant
.mockResolvedValue([

{
status:"Late",
amount:5000
},

{
status:"Late",
amount:5000
},

{
status:"Late",
amount:5000
}

]);



createRiskRecord
.mockResolvedValue({

tenantId:101,

riskLevel:"High",

latePayments:3

});





// Act

const result =

await analyzeTenantRisk(

101

);





// Assert


expect(

getPaymentsByTenant

)

.toHaveBeenCalledWith(

101

);



expect(

result.riskLevel

)

.toBe(

"High"

);



});









it(
"should detect unpaid balance correctly",
async()=>{


// Arrange


getPaymentsByTenant
.mockResolvedValue([


{

status:"Pending",

amount:5000

}

]);



createRiskRecord
.mockResolvedValue({

riskLevel:"High",

unpaidBalance:5000

});






// Act


const result =

await analyzeTenantRisk(

101

);






// Assert


expect(

result.riskLevel

)

.toBe(

"High"

);



});









it(
"should generate low risk for good payment history",
async()=>{


// Arrange


getPaymentsByTenant
.mockResolvedValue([

{

status:"Paid",

amount:5000

}

]);



createRiskRecord
.mockResolvedValue({

riskLevel:"Low"

});






// Act


const result =

await analyzeTenantRisk(

101

);






// Assert


expect(

result.riskLevel

)

.toBe(

"Low"

);



});









it(
"should retrieve high-risk tenants",
async()=>{


// Arrange


getHighRiskRecords
.mockResolvedValue([

{

tenantId:101,

riskLevel:"High"

}

]);






// Act


const result =

await getHighRiskTenants();






// Assert


expect(result)

.toHaveLength(

1

);



expect(result[0].riskLevel)

.toBe(

"High"

);



});





});