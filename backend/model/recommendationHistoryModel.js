import { supabase } from "../config/supabaseClient.js";

/*
|--------------------------------------------------------------------------
| Create Recommendation History Record
|--------------------------------------------------------------------------
| Saves every recommendation lifecycle change
|--------------------------------------------------------------------------
*/

export async function createRecommendationHistory(data) {
  const { recommendationId, action, oldStatus, newStatus, changedBy, notes } =
    data;

  const { data: history, error } = await supabase

    .from("recommendation_history")

    .insert({
      recommendation_id: recommendationId,

      action,

      old_status: oldStatus ?? null,

      new_status: newStatus ?? null,

      changed_by: changedBy ?? null,

      notes: notes ?? null,

      created_at: new Date(),
    })

    .select()

    .single();

  if (error) {
    throw new Error(error.message);
  }

  return history;
}

/*
|--------------------------------------------------------------------------
| Get Recommendation History By Recommendation
|--------------------------------------------------------------------------
*/

export async function getRecommendationHistoryById(recommendationId) {
  const { data, error } = await supabase

    .from("recommendation_history")

    .select(
      `

      *,

      recommendations(
        title,
        category,
        priority
      )

    `,
    )

    .eq("recommendation_id", recommendationId)

    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Get All Recommendation History
|--------------------------------------------------------------------------
*/

export async function getAllRecommendationHistory() {
  const { data, error } = await supabase

    .from("recommendation_history")

    .select(
      `

      *,

      recommendations(

        title,

        description,

        category,

        priority,

        tenant_id

      )

    `,
    )

    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Record Recommendation Status Change
|--------------------------------------------------------------------------
| Helper function used when:
|
| Active -> Resolved
| Active -> Inactive
| Pending -> Active
|--------------------------------------------------------------------------
*/

export async function logRecommendationStatusChange({
  recommendationId,
  previousStatus,
  currentStatus,
  changedBy = null,
  notes = null,
}) {
  return await createRecommendationHistory({
    recommendationId,

    action: "STATUS_UPDATE",

    oldStatus: previousStatus,

    newStatus: currentStatus,

    changedBy,

    notes,
  });
}

/*
|--------------------------------------------------------------------------
| Delete History
|--------------------------------------------------------------------------
| Used only for cleanup/testing
|--------------------------------------------------------------------------
*/

export async function deleteRecommendationHistory(recommendationId) {
  const { error } = await supabase

    .from("recommendation_history")

    .delete()

    .eq("recommendation_id", recommendationId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
