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


  const records = data ?? [];
  if (!records.length) return records;

  const { data: utilities, error: utilityError } = await supabase
    .from("utility_billings")
    .select("*")
    .in("billing_id", records.map((record) => record.id));

  if (utilityError) {
    throw new Error(`Failed to retrieve utility billing records: ${utilityError.message}`);
  }

  return records.map((record) => ({
    ...record,
    utility: (utilities ?? []).find((item) => item.billing_id === record.id) ?? null,
  }));
}

export async function upsertUtilityBilling(billingId, amounts) {
  const { data: billing, error: billingError } = await supabase
    .from("billings").select("id, tenant_id").eq("id", billingId).maybeSingle();
  if (billingError || !billing) throw new Error(billingError?.message || "Billing record not found");

  const payload = {
    billing_id: billing.id,
    tenant_id: billing.tenant_id,
    electricity_amount: Number(amounts.electricityAmount ?? 0),
    water_amount: Number(amounts.waterAmount ?? 0),
    internet_amount: Number(amounts.internetAmount ?? 0),
    updated_at: new Date().toISOString(),
  };
  const { data: existing, error: findError } = await supabase
    .from("utility_billings").select("id").eq("billing_id", billingId).maybeSingle();
  if (findError) throw new Error(`Failed to retrieve utility billing: ${findError.message}`);
  const query = existing
    ? supabase.from("utility_billings").update(payload).eq("id", existing.id)
    : supabase.from("utility_billings").insert(payload);
  const { data, error } = await query.select("*").single();
  if (error) throw new Error(`Failed to save utility billing: ${error.message}`);
  return data;
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
