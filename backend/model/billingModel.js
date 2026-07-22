/*
|--------------------------------------------------------------------------
| Billing Model
|--------------------------------------------------------------------------
| Responsible for:
| - storing billing records
| - retrieving billing records
| - updating billing records
|
| Business calculations are handled in service layer.
|--------------------------------------------------------------------------
*/

import { supabase } from "../config/supabaseClient.js";


/*
|--------------------------------------------------------------------------
| Create Billing Record
|--------------------------------------------------------------------------
*/

export async function createBillingRecord(billingData) {

  const { data, error } = await supabase
    .from("billings")
    .insert({
      tenant_id: billingData.tenantId,

      room_id: billingData.roomId,

      billing_period: billingData.billingPeriod,

      due_date: billingData.dueDate,

      total_amount: billingData.totalAmount,

      paid_amount: billingData.paidAmount ?? 0,

      remaining_balance:
        billingData.remainingBalance ??
        billingData.totalAmount,

      status:
        billingData.status ??
        "Unpaid",

      billing_type:
        billingData.billingType ??
        "Rent",
    })
    .select()
    .single();


  if (error) {
    throw new Error(
      `Failed to create billing: ${error.message}`
    );
  }


  return data;
}


/*
|--------------------------------------------------------------------------
| Get All Billing Records
|--------------------------------------------------------------------------
*/

export async function getBillingInformation() {

  const { data, error } = await supabase
    .from("billings")
    .select(`
      *,
      tenants(
        id,
        full_name,
        email
      ),
      rooms(
        id,
        room_number
      )
    `)
    .order(
      "created_at",
      {
        ascending:false
      }
    );


  if(error){

    throw new Error(
      `Failed to retrieve billing records: ${error.message}`
    );

  }


  return data ?? [];
}



/*
|--------------------------------------------------------------------------
| Get Tenant Billing History
|--------------------------------------------------------------------------
*/

export async function getTenantBilling(tenantId){

  const { data,error } = await supabase
    .from("billings")
    .select(`
      *,
      rooms(
        room_number
      )
    `)
    .eq(
      "tenant_id",
      tenantId
    )
    .order(
      "billing_period",
      {
        ascending:false
      }
    );


  if(error){

    throw new Error(
      `Failed to retrieve tenant billing: ${error.message}`
    );

  }


  return data ?? [];

}



/*
|--------------------------------------------------------------------------
| Get Billing By ID
|--------------------------------------------------------------------------
*/

export async function getBillingById(
  billingId
){

  const {data,error}=await supabase
    .from("billings")
    .select("*")
    .eq(
      "id",
      billingId
    )
    .single();



  if(error){

    throw new Error(
      `Billing not found: ${error.message}`
    );

  }


  return data;

}



/*
|--------------------------------------------------------------------------
| Update Billing
|--------------------------------------------------------------------------
*/

export async function updateBillingRecord(
  billingId,
  updateData
){

  const {data,error}=await supabase
    .from("billings")
    .update(updateData)
    .eq(
      "id",
      billingId
    )
    .select()
    .single();



  if(error){

    throw new Error(
      `Failed to update billing: ${error.message}`
    );

  }


  return data;

}



/*
|--------------------------------------------------------------------------
| Get Revenue Data
|--------------------------------------------------------------------------
*/

export async function getRevenueBillingRecords(){

  const {data,error}=await supabase
    .from("billings")
    .select(`
      id,
      total_amount,
      paid_amount,
      status,
      billing_period
    `);



  if(error){

    throw new Error(
      `Failed to retrieve revenue data: ${error.message}`
    );

  }


  return data ?? [];

}