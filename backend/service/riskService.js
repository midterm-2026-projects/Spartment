import {
  getPaymentsByTenant,
  getPayments,
} from "../model/paymentModel.js";


import {
  createRiskRecord,
  getHighRiskRecords,
} from "../model/riskModel.js";








/*
|--------------------------------------------------------------------------
| Analyze Tenant Risk
|--------------------------------------------------------------------------
|
| Checks:
| - Late payment patterns
| - Unpaid balances
| - Payment history
|
|--------------------------------------------------------------------------
*/


export async function analyzeTenantRisk(

tenantId

){


const payments =

await getPaymentsByTenant(

tenantId

);






if(!payments || payments.length === 0){


throw new Error(

"No payment records found."

);


}








let latePayments = 0;

let unpaidBalance = 0;


let indicators = [];








payments.forEach(payment => {




if(payment.status === "Late"){


latePayments++;


}





if(

payment.status === "Pending"

){


unpaidBalance +=

payment.amount;


}




});









/*
|--------------------------------------------------------------------------
| Risk Calculation
|--------------------------------------------------------------------------
*/


let riskLevel = "Low";





if(

latePayments >= 3 ||

unpaidBalance > 0

){


riskLevel = "High";


}





else if(

latePayments >= 1

){


riskLevel = "Medium";


}









/*
|--------------------------------------------------------------------------
| Generate Risk Indicators
|--------------------------------------------------------------------------
*/


if(latePayments > 0){


indicators.push(

`${latePayments} late payment(s) detected`

);


}




if(unpaidBalance > 0){


indicators.push(

`Outstanding balance of ${unpaidBalance}`

);


}







if(indicators.length === 0){


indicators.push(

"Payments are up to date."

);


}









const riskRecord =

await createRiskRecord({


tenantId,


riskLevel,


indicators,


latePayments,


unpaidBalance


});







return riskRecord;


}












/*
|--------------------------------------------------------------------------
| Get High Risk Tenants
|--------------------------------------------------------------------------
*/


export async function getHighRiskTenants(){


return await getHighRiskRecords();


}