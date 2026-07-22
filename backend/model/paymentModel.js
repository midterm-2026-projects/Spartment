/*
|--------------------------------------------------------------------------
| Payment Model
|--------------------------------------------------------------------------
| Responsible for:
| - creating payments
| - retrieving payments
| - updating payment status
|--------------------------------------------------------------------------
*/


import { supabase } from "../config/supabaseClient.js";



/*
|--------------------------------------------------------------------------
| Create Payment
|--------------------------------------------------------------------------
*/

export async function createPaymentRecord(data){


  const {result,error}=await supabase
    .from("payments")
    .insert({

      billing_id:data.billingId,

      tenant_id:data.tenantId,

      amount:data.amount,

      payment_method:
        data.paymentMethod ??
        "Cash",

      payment_reference:
        data.paymentReference,

      verification_status:
        "Pending",

      payment_status:
        "Pending",

      payment_date:
        data.paymentDate ??
        new Date(),

    })
    .select()
    .single();



  if(error){

    throw new Error(
      `Failed to create payment: ${error.message}`
    );

  }


  return result;

}



/*
|--------------------------------------------------------------------------
| Get Payment By ID
|--------------------------------------------------------------------------
*/

export async function getPaymentById(
  paymentId
){


  const {data,error}=await supabase
    .from("payments")
    .select("*")
    .eq(
      "id",
      paymentId
    )
    .single();



  if(error){

    throw new Error(
      `Payment not found: ${error.message}`
    );

  }


  return data;

}



/*
|--------------------------------------------------------------------------
| Update Payment
|--------------------------------------------------------------------------
*/

export async function updatePaymentStatus(
  paymentId,
  updateData
){

  const {data,error}=await supabase
    .from("payments")
    .update(updateData)
    .eq(
      "id",
      paymentId
    )
    .select()
    .single();



  if(error){

    throw new Error(
      `Failed to update payment: ${error.message}`
    );

  }


  return data;

}



/*
|--------------------------------------------------------------------------
| Tenant Payment History
|--------------------------------------------------------------------------
*/

export async function getPaymentsByTenant(
  tenantId
){


  const {data,error}=await supabase
    .from("payments")
    .select(`
      *,
      billings(
        billing_period,
        total_amount
      )
    `)
    .eq(
      "tenant_id",
      tenantId
    )
    .order(
      "payment_date",
      {
        ascending:false
      }
    );


  if(error){

    throw new Error(
      `Failed to retrieve tenant payments: ${error.message}`
    );

  }


  return data ?? [];

}



/*
|--------------------------------------------------------------------------
| All Payments
|--------------------------------------------------------------------------
*/

export async function getPayments(){


  const {data,error}=await supabase
    .from("payments")
    .select("*")
    .order(
      "created_at",
      {
        ascending:false
      }
    );



  if(error){

    throw new Error(
      `Failed to retrieve payments: ${error.message}`
    );

  }


  return data ?? [];

}