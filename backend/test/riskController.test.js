import {
describe,
it,
expect,
vi,
} from "vitest";



vi.mock(
"../service/riskService.js",
()=>({

analyzeTenantRisk:
vi.fn(),


getHighRiskTenants:
vi.fn()

})

);



import {

analyzeTenantRiskController,

getHighRiskTenantList

}

from "../controller/riskController.js";



import {

analyzeTenantRisk,

getHighRiskTenants

}

from "../service/riskService.js";







function responseMock(){


return {

status:

vi.fn()

.mockReturnThis(),


json:

vi.fn()

};


}








describe(
"Risk Controller",
()=>{





it(
"should return tenant risk analysis",
async()=>{


analyzeTenantRisk
.mockResolvedValue({

tenantId:101,

riskLevel:"High"

});




const req = {

params:{
tenantId:101
}

};



const res = responseMock();





await analyzeTenantRiskController(

req,

res

);





expect(

res.status

)

.toHaveBeenCalledWith(

200

);



});










it(
"should return high-risk tenants",
async()=>{


getHighRiskTenants
.mockResolvedValue([

{

tenantId:101,

riskLevel:"High"

}

]);




const req={};



const res=responseMock();





await getHighRiskTenantList(

req,

res

);





expect(

res.status

)

.toHaveBeenCalledWith(

200

);



});





});