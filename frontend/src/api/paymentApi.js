import axios from "axios";


const API_URL =
"http://localhost:5000/api/payment";



export async function confirmPayment(
id,
paymentData
){


try{


const response =
await axios.patch(

`${API_URL}/${id}/confirm`,

paymentData

);



return response.data;



}catch(error){


throw new Error(
"Failed to confirm payment."
);


}


}





export async function getPaymentHistory(
tenantId
){


try{


const response =
await axios.get(

`${API_URL}/tenant/${tenantId}`

);



return response.data;



}catch(error){


throw new Error(
"Failed to retrieve payment history."
);


}


}





export async function getPaymentMetrics(){


try{


const response =
await axios.get(

`${API_URL}/metrics`

);



return response.data;



}catch(error){


throw new Error(
"Failed to retrieve payment metrics."
);


}


}