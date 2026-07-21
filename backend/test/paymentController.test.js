import {

describe,

it,

expect,

vi

}

from "vitest";



vi.mock(

"../service/paymentService.js",

()=>({

confirmPayment:

vi.fn(),

getPaymentHistory:

vi.fn(),

getPaymentMetrics:

vi.fn(),

})

);



import {

confirmPaymentStatus,

getTenantPayments,

getRevenueMetrics,

}

from "../controller/paymentController.js";



import {

confirmPayment,

getPaymentHistory,

getPaymentMetrics,

}

from "../service/paymentService.js";






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

"Payment Controller",

()=>{





it(

"should confirm payment successfully",

async()=>{



// Arrange

confirmPayment

.mockResolvedValue({

id:1,

status:"Paid"

});



const req={

params:{

id:1

},


body:{

paymentMethod:"Cash"

}

};




const res=

responseMock();







// Act

await confirmPaymentStatus(

req,

res

);






// Assert


expect(

confirmPayment

)

.toHaveBeenCalledWith(

1,

"Cash"

);



expect(

res.status

)

.toHaveBeenCalledWith(

200

);



});









it(

"should get tenant payment history",

async()=>{



// Arrange


getPaymentHistory

.mockResolvedValue([

{

id:1,

status:"Paid"

}

]);





const req={

params:{

tenantId:101

}

};




const res=

responseMock();





// Act


await getTenantPayments(

req,

res

);





// Assert


expect(

getPaymentHistory

)

.toHaveBeenCalledWith(

101

);



expect(

res.status

)

.toHaveBeenCalledWith(

200

);



});









it(

"should return revenue metrics",

async()=>{



getPaymentMetrics

.mockResolvedValue({

collectedRevenue:5000,

pendingPayments:1,

latePayments:0

});





const req={};



const res=

responseMock();





await getRevenueMetrics(

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