import { supabase } from "../config/supabaseClient.js";

/*
|---------------------------------------------------------------------------
| Create Recommendation
|---------------------------------------------------------------------------
|
| Saves generated smart recommendation.
|
| Prevents duplicate active recommendation
| for the same tenant and condition.
|
|---------------------------------------------------------------------------
*/

export async function createRecommendation(data) {

  const {
    riskAssessmentId,
    tenantId,
    roomId,
    title,
    description,
    priority,
    category,
    sourceCondition,
  } = data;



  /*
  |--------------------------------------------------------------------------
  | Prevent duplicate active recommendation
  |--------------------------------------------------------------------------
  */

  const {
    data: existing,
    error: existingError,

  } = await supabase

    .from("recommendations")

    .select("id")

    .eq(
      "tenant_id",
      tenantId
    )

    .eq(
      "source_condition",
      sourceCondition
    )

    .eq(
      "status",
      "Active"
    )

    .maybeSingle();



  if (existingError) {

    throw new Error(
      existingError.message
    );

  }



  if (existing) {

    return existing;

  }



  /*
  |--------------------------------------------------------------------------
  | Insert recommendation
  |--------------------------------------------------------------------------
  */

  const {
    data: recommendation,
    error,

  } = await supabase

    .from("recommendations")

    .insert({

      risk_assessment_id:
        riskAssessmentId,


      tenant_id:
        tenantId,


      room_id:
        roomId,


      title,


      description,


      priority,


      category,


      source_condition:
        sourceCondition,


      status:
        "Active",


      generated_date:
        new Date(),

    })

    .select()

    .single();



  if (error) {

    throw new Error(
      error.message
    );

  }



  return recommendation;

}





/*
|--------------------------------------------------------------------------
| Get Active Recommendations
|--------------------------------------------------------------------------
*/

export async function getActiveRecommendations() {


  const {
    data,
    error,

  } = await supabase


    .from("recommendations")


    .select(

`
*,

tenants(
  full_name,
  email
),

risk_assessments(
  risk_level,
  risk_category,
  risk_score
)

`

    )


    .eq(
      "status",
      "Active"
    )


    .order(
      "priority",
      {
        ascending:false,
      }
    );



  if(error){

    throw new Error(
      error.message
    );

  }



  return data;

}





/*
|--------------------------------------------------------------------------
| Get Recommendations By Tenant
|--------------------------------------------------------------------------
*/

export async function getRecommendationsByTenant(
  tenantId
){


  const {
    data,
    error,

  } = await supabase


    .from("recommendations")


    .select(

`
*,

risk_assessments(*)

`

    )


    .eq(
      "tenant_id",
      tenantId
    )


    .order(
      "generated_date",
      {
        ascending:false,
      }
    );



  if(error){

    throw new Error(
      error.message
    );

  }



  return data;

}





/*
|--------------------------------------------------------------------------
| Update Recommendation Status
|--------------------------------------------------------------------------
|
| Active -> Resolved / Inactive
|
|--------------------------------------------------------------------------
*/

export async function updateRecommendationStatus(
  id,
  status
){


  const {
    data,
    error,

  } = await supabase


    .from("recommendations")


    .update({

      status,


      updated_at:
        new Date(),

    })


    .eq(
      "id",
      id
    )


    .select()


    .single();



  if(error){

    throw new Error(
      error.message
    );

  }



  return data;

}





/*
|--------------------------------------------------------------------------
| Resolve Old Recommendations
|--------------------------------------------------------------------------
|
| Marks outdated active recommendations
| as resolved after 30 days.
|
|--------------------------------------------------------------------------
*/

export async function resolveOldRecommendations(){


  const {
    data,
    error,

  } = await supabase


    .from("recommendations")


    .update({

      status:
        "Resolved",


      updated_at:
        new Date(),

    })


    .eq(
      "status",
      "Active"
    )


    .lt(

      "updated_at",

      new Date(
        Date.now()
        -
        30 *
        24 *
        60 *
        60 *
        1000
      )

    )


    .select();



  if(error){

    throw new Error(
      error.message
    );

  }



  return data;

}





/*
|--------------------------------------------------------------------------
| Get Recommendation History
|--------------------------------------------------------------------------
*/

export async function getRecommendationHistory(){


  const {
    data,
    error,

  } = await supabase


    .from("recommendations")


    .select(

`
*,

recommendation_history(*)

`

    )


    .order(

      "generated_date",

      {
        ascending:false,
      }

    );



  if(error){

    throw new Error(
      error.message
    );

  }



  return data;

}

// Compatibility alias used by the dashboard and analytics services.
export async function getRecommendations() {
  return getActiveRecommendations();
}
