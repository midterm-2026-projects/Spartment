import supabase from "../config/supabaseClient.js";

function throwDatabaseError(error, fallbackMessage) {
  if (error) {
    throw new Error(error.message || fallbackMessage);
  }
}

export async function createInquiryRecord(data) {
  const {
    name,
    email,
    contact,
    roomId,
    type,
    moveInDate,
    message,
  } = data;

  const { data: inquiry, error } = await supabase
    .from("inquiries")
    .insert({
      name,
      email,
      contact,
      room_id: roomId,
      type,
      move_in_date: moveInDate,
      message,
      status: "Pending",
    })
    .select(`
      *,
      room:rooms (
        id,
        room_number,
        room_type,
        monthly_rent,
        status
      )
    `)
    .single();

  throwDatabaseError(error, "Failed to create inquiry");

  return inquiry;
}

export async function getInquiryRecords() {
  const { data, error } = await supabase
    .from("inquiries")
    .select(`
      *,
      room:rooms (
        id,
        room_number,
        room_type,
        monthly_rent,
        status
      ),
      reviewer:users!inquiries_reviewed_by_fkey (
        id,
        name,
        email
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  throwDatabaseError(
    error,
    "Failed to retrieve inquiries",
  );

  return data ?? [];
}

export async function getInquiryRecordById(inquiryId) {
  const { data, error } = await supabase
    .from("inquiries")
    .select(`
      *,
      room:rooms (
        id,
        room_number,
        room_type,
        monthly_rent,
        status
      )
    `)
    .eq("id", inquiryId)
    .maybeSingle();

  throwDatabaseError(
    error,
    "Failed to retrieve inquiry",
  );

  return data;
}

export async function approveInquiryRecord({
  inquiryId,
  reviewedBy,
}) {
  const { data, error } = await supabase.rpc(
    "approve_inquiry",
    {
      p_inquiry_id: inquiryId,
      p_reviewed_by: reviewedBy,
    },
  );

  throwDatabaseError(
    error,
    "Failed to approve inquiry",
  );

  return data;
}

export async function rejectInquiryRecord({
  inquiryId,
  reviewedBy,
}) {
  const { data, error } = await supabase.rpc(
    "reject_inquiry",
    {
      p_inquiry_id: inquiryId,
      p_reviewed_by: reviewedBy,
    },
  );

  throwDatabaseError(
    error,
    "Failed to reject inquiry",
  );

  return data;
}

export async function updateInquiryRecord(
  inquiryId,
  updates,
) {
  const allowedUpdates = {};

  if (updates.name !== undefined) {
    allowedUpdates.name = updates.name;
  }

  if (updates.email !== undefined) {
    allowedUpdates.email = updates.email;
  }

  if (updates.contact !== undefined) {
    allowedUpdates.contact = updates.contact;
  }

  if (updates.roomId !== undefined) {
    allowedUpdates.room_id = updates.roomId;
  }

  if (updates.type !== undefined) {
    allowedUpdates.type = updates.type;
  }

  if (updates.moveInDate !== undefined) {
    allowedUpdates.move_in_date =
      updates.moveInDate;
  }

  if (updates.message !== undefined) {
    allowedUpdates.message = updates.message;
  }

  allowedUpdates.updated_at =
    new Date().toISOString();

  const { data, error } = await supabase
    .from("inquiries")
    .update(allowedUpdates)
    .eq("id", inquiryId)
    .select()
    .maybeSingle();

  throwDatabaseError(
    error,
    "Failed to update inquiry",
  );

  return data;
}

export async function resetInquiryRecords() {
  const { error } = await supabase
    .from("inquiries")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  throwDatabaseError(
    error,
    "Failed to reset inquiries",
  );

  return true;
}