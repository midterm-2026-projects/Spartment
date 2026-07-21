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
  inquiry:inquiries (
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
}) {
  const { data, error } = await supabase.rpc(
    "create_tenant_from_approved_inquiry",
    {
      p_inquiry_id: inquiryId,
      p_full_name: fullName,
      p_email: email,
      p_contact: contact,
      p_room_id: roomId,
      p_username: username,
      p_password_hash: passwordHash,
      p_created_by: createdBy,
    },
  );

  throwDatabaseError(error, "Failed to create tenant account");

  return data;
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
