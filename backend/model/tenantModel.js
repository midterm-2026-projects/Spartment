import supabase from "../config/supabaseClient.js";

function throwDatabaseError(error, fallbackMessage) {
  if (error) {
    throw new Error(error.message || fallbackMessage);
  }
}

const tenantSelect = `
  *,
  user:users (
    id,
    name,
    email,
    username,
    role,
    status,
    created_at
  ),
  room:rooms (
    id,
    room_number,
    room_type,
    monthly_rent,
    status
  ),
  inquiry:inquiries!tenants_inquiry_fk (
    id,
    status,
    move_in_date
  )
`;

export async function createTenant({
  inquiryId,
  fullName,
  email,
  contact,
  roomId,
  username,
  passwordHash,
  createdBy,
  moveInDate,
}) {
  let user = null;
  let tenant = null;
  try {
    const { data: createdUser, error: userError } = await supabase.from("users").insert({
      name: fullName, email, username, password_hash: passwordHash,
      role: "tenant", status: "Active",
    }).select("id, name, email, username").single();
    throwDatabaseError(userError, "Failed to create tenant user");
    user = createdUser;

    const { data: createdTenant, error: tenantError } = await supabase.from("tenants").insert({
      inquiry_id: inquiryId, user_id: user.id, room_id: roomId,
      full_name: fullName, email, contact, status: "Active",
      move_in_date: moveInDate || new Date().toISOString().slice(0, 10),
    }).select("*").single();
    throwDatabaseError(tenantError, "Failed to create tenant profile");
    tenant = createdTenant;

    const { error: roomError } = await supabase.from("rooms").update({ status: "Occupied" }).eq("id", roomId);
    throwDatabaseError(roomError, "Failed to assign tenant room");

    const { error: notificationError } = await supabase.from("notifications").insert({
      user_id: user.id, tenant_id: tenant.id, inquiry_id: inquiryId,
      title: "Tenant account created",
      message: "Your tenant account has been created successfully.",
      type: "Account", is_read: false,
    });
    throwDatabaseError(notificationError, "Failed to create tenant notification");

    return {
      tenant_id: tenant.id, user_id: user.id, inquiry_id: inquiryId,
      room_id: roomId, room_status: "Occupied", created_by: createdBy,
      username,
    };
  } catch (error) {
    if (tenant?.id) await supabase.from("tenants").delete().eq("id", tenant.id);
    if (user?.id) await supabase.from("users").delete().eq("id", user.id);
    if (tenant?.id) await supabase.from("rooms").update({ status: "Available" }).eq("id", roomId);
    throw error;
  }
}

export async function getTenants() {
  const { data, error } = await supabase
    .from("tenants")
    .select(tenantSelect)
    .order("created_at", {
      ascending: false,
    });

  throwDatabaseError(error, "Failed to retrieve tenants");

  return data ?? [];
}

export async function getTenantById(tenantId) {
  const { data, error } = await supabase
    .from("tenants")
    .select(tenantSelect)
    .eq("id", tenantId)
    .maybeSingle();

  throwDatabaseError(error, "Failed to retrieve tenant");

  return data;
}

export async function getTenantByUserId(userId) {
  const { data, error } = await supabase
    .from("tenants")
    .select(tenantSelect)
    .eq("user_id", userId)
    .maybeSingle();

  throwDatabaseError(error, "Failed to retrieve tenant");

  return data;
}

export async function getTenantByEmail(email) {
  const { data, error } = await supabase
    .from("tenants")
    .select(tenantSelect)
    .ilike("email", email)
    .maybeSingle();

  throwDatabaseError(error, "Failed to retrieve tenant");

  return data;
}

export async function getTenantByInquiryId(inquiryId) {
  const { data, error } = await supabase
    .from("tenants")
    .select(tenantSelect)
    .eq("inquiry_id", inquiryId)
    .maybeSingle();

  throwDatabaseError(error, "Failed to retrieve tenant");

  return data;
}

export async function updateTenantPassword(tenantId, passwordHash) {
  const tenant = await getTenantById(tenantId);

  if (!tenant) {
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .update({
      password_hash: passwordHash,
      updated_at: new Date().toISOString(),
    })
    .eq("id", tenant.user_id)
    .select(
      `
      id,
      name,
      email,
      username,
      role,
      status,
      updated_at
    `,
    )
    .maybeSingle();

  throwDatabaseError(error, "Failed to update password");

  return {
    tenantId,
    user: data,
  };
}

export async function updateTenantStatus(tenantId, status, moveOutDate = null) {
  const updates = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === "Moved Out") {
    updates.move_out_date = moveOutDate;
  } else {
    updates.move_out_date = null;
  }

  const { data, error } = await supabase
    .from("tenants")
    .update(updates)
    .eq("id", tenantId)
    .select(tenantSelect)
    .maybeSingle();

  throwDatabaseError(error, "Failed to update tenant status");

  return data;
}

export async function resetTenants() {
  const { error } = await supabase
    .from("tenants")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  throwDatabaseError(error, "Failed to reset tenants");

  return true;
}
