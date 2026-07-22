/*
|--------------------------------------------------------------------------
| Payment Transaction Model
|--------------------------------------------------------------------------
| Stores payment status history.
|--------------------------------------------------------------------------
*/


import { supabase } from "../config/supabaseClient.js";



export async function createPaymentTransaction(data){


  const {data:transaction,error}=await supabase
    .from("payment_transactions")
    .insert({

      payment_id:data.paymentId,

      transaction_type:
        data.transactionType,

      amount:
        data.amount,

      description:
        data.description

    })
    .select()
    .single();



  if(error){

    throw new Error(
      `Failed to create payment transaction: ${error.message}`
    );

  }


  return transaction;

}



export async function getPaymentTransactions(
  paymentId
){

  const {data,error}=await supabase
    .from("payment_transactions")
    .select("*")
    .eq(
      "payment_id",
      paymentId
    )
    .order(
      "created_at",
      {
        ascending:false
      }
    );


  if(error){

    throw new Error(
      `Failed to retrieve payment transactions: ${error.message}`
    );

  }


  return data ?? [];

}