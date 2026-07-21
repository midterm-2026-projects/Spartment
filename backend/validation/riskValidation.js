/*
|--------------------------------------------------------------------------
| Validate Tenant Risk Request
|--------------------------------------------------------------------------
|
| Used before running risk analysis.
|
| Checks:
| - tenantId exists
| - tenantId format is valid
|
|--------------------------------------------------------------------------
*/


export function validateRiskTenantId(
  req,
  res,
  next
){


const {
  tenantId
} = req.params;





if(!tenantId){


return res.status(400).json({

message:
"Tenant ID is required."

});


}







if(

isNaN(Number(tenantId))

){


return res.status(400).json({


message:
"Invalid tenant ID."

});


}






next();


}