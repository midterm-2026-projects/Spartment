import {
  fetchBillingRecords,
} from "../model/billingModel.js";

import {
  fetchRooms,
} from "../model/roomModel.js";

import {
  fetchTenants,
} from "../model/tenantModel.js";


export async function fetchAnalyticsData() {

  try {


    const billing =
      await fetchBillingRecords();


    const rooms =
      await fetchRooms();


    const tenants =
      await fetchTenants();



    return {

      totalRevenue:
        calculateRevenue(
          billing
        ),


      occupancyRate:
        calculateOccupancy(
          rooms
        ),


      totalTenants:
        tenants.length,


      paymentStatus:
        calculatePaymentStatus(
          billing
        ),


      tenantGrowth:
        calculateTenantGrowth(
          tenants
        ),


      revenueTrend:
        generateRevenueTrend(
          billing
        ),


      recommendations:
        generateRecommendations(
          billing,
          rooms
        ),

    };


  } catch(error){

    throw new Error(
      "Failed to retrieve analytics information."
    );

  }

}



function calculateRevenue(
  billing
){

  return billing.reduce(
    (total,item)=>
      total + item.amount,
    0
  );

}




function calculateOccupancy(
  rooms
){

  if(
    rooms.length === 0
  ){
    return 0;
  }


  const occupied =
    rooms.filter(
      room =>
        room.status === "Occupied"
    ).length;



  return Number(
    (
      occupied /
      rooms.length *
      100
    ).toFixed(2)
  );

}




function calculatePaymentStatus(
  billing
){

  return {

    paid:
      billing.filter(
        item =>
          item.status === "Paid"
      ).length,


    pending:
      billing.filter(
        item =>
          item.status === "Pending"
      ).length,


    overdue:
      billing.filter(
        item =>
          item.status === "Overdue"
      ).length,

  };

}




function calculateTenantGrowth(
 tenants
){

 return tenants.length;

}



function generateRevenueTrend(
 billing
){

 return billing.map(
  item=>({

    month:item.month,

    amount:item.amount

  })
 );

}



function generateRecommendations(
 billing,
 rooms
){

 const recommendations=[];


 const overdue =
 billing.filter(
  item =>
   item.status==="Overdue"
 );


 if(overdue.length>0){

  recommendations.push({

   title:
   "Follow up on late payments",

   message:
   `${overdue.length} overdue payments detected.`

  });

 }



 const vacant =
 rooms.filter(
  room =>
   room.status==="Vacant"
 );


 if(vacant.length>0){

 recommendations.push({

  title:
  "Vacant rooms detected",

  message:
  `${vacant.length} vacant rooms available.`

 });

 }


 return recommendations;

}