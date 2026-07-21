import bcrypt from "bcryptjs";

import {
  createTenant,
  getTenants,
  getTenantById,
  getTenantByUserId,
  getTenantByEmail,
  getTenantByInquiryId,
  updateTenantPassword as updateTenantPasswordRecord,
  updateTenantStatus as updateTenantStatusRecord,
} from "../model/tenantModel.js";

import { getInquiryRecordById } from "../model/inquiryModel.js";

import { getRoomById } from "../model/roomModel.js";

import { generateBilling } from "./billingService.js";

import {
  validateCreateTenant,
  validateTenantPassword,
} from "../validation/tenantValidation.js";

const PASSWORD_SALT_ROUNDS = 12;

export async function createTenantAccount(data) {
  validateCreateTenant(data);

  const normalizedData = {
    inquiryId: data.inquiryId,
    fullName: String(data.fullName).trim(),
    email: String(data.email).trim().toLowerCase(),
    contact: data.contact ? String(data.contact).trim() : null,
    roomId: data.roomId,
    username: String(data.username).trim(),
    password: String(data.password),
    createdBy: data.createdBy,
  };

  if (!normalizedData.createdBy) {
    throw new Error("Administrator ID is required");
  }

  const inquiry = await getInquiryRecordById(normalizedData.inquiryId);

  if (!inquiry) {
    throw new Error("Inquiry not found");
  }

  if (inquiry.status !== "Approved") {
    throw new Error("Only approved inquiries can create tenant accounts");
  }

  const tenantFromInquiry = await getTenantByInquiryId(
    normalizedData.inquiryId,
  );

  if (tenantFromInquiry) {
    throw new Error(
      "A tenant account has already been created for this inquiry",
    );
  }

  const existingTenant = await getTenantByEmail(normalizedData.email);

  if (existingTenant) {
    throw new Error("Tenant already exists");
  }

  const room = await getRoomById(normalizedData.roomId);

  if (!room) {
    throw new Error("Room not found");
  }

  if (room.status !== "Available") {
    throw new Error("Room is not available");
  }

  const passwordHash = await bcrypt.hash(
    normalizedData.password,
    PASSWORD_SALT_ROUNDS,
  );

  const createdRecord = await createTenant({
    inquiryId: normalizedData.inquiryId,
    fullName: normalizedData.fullName,
    email: normalizedData.email,
    contact: normalizedData.contact,
    roomId: normalizedData.roomId,
    username: normalizedData.username,
    passwordHash,
    createdBy: normalizedData.createdBy,
  });

  let billing = null;

  try {
    billing = await generateBilling({
      tenantId: createdRecord.tenant_id,
      billingType: "initial",
    });
  } catch (error) {
    throw new Error(
      `Tenant account was created, but initial billing failed: ${error.message}`,
    );
  }

  return {
    tenant: createdRecord,
    billing,
  };
}

export async function fetchTenants() {
  return getTenants();
}

export async function fetchTenantById(tenantId) {
  if (!tenantId) {
    throw new Error("Tenant ID is required");
  }

  const tenant = await getTenantById(tenantId);

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  return tenant;
}

export async function fetchTenantByUserId(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const tenant = await getTenantByUserId(userId);

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  return tenant;
}

export async function fetchTenantByEmail(email) {
  if (!email || !String(email).trim()) {
    throw new Error("Tenant email is required");
  }

  const tenant = await getTenantByEmail(String(email).trim().toLowerCase());

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  return tenant;
}

export async function findTenantByName(name) {
  if (!name || !String(name).trim()) {
    throw new Error("Tenant name is required");
  }

  const normalizedName = String(name).trim().toLowerCase();

  const tenants = await getTenants();

  const tenant = tenants.find((record) => {
    const fullName = record.full_name ?? record.user?.name ?? "";

    return String(fullName).trim().toLowerCase() === normalizedName;
  });

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  return tenant;
}

export async function updateTenantPassword(tenantId, password) {
  if (!tenantId) {
    throw new Error("Tenant ID is required");
  }

  validateTenantPassword(password);

  const tenant = await getTenantById(tenantId);

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  const passwordHash = await bcrypt.hash(
    String(password),
    PASSWORD_SALT_ROUNDS,
  );

  const result = await updateTenantPasswordRecord(tenantId, passwordHash);

  if (!result) {
    throw new Error("Tenant not found");
  }

  return result;
}

export async function changeTenantStatus(tenantId, status, moveOutDate = null) {
  const allowedStatuses = ["Active", "Inactive", "Moved Out"];

  if (!tenantId) {
    throw new Error("Tenant ID is required");
  }

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid tenant status");
  }

  const tenant = await getTenantById(tenantId);

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  const finalMoveOutDate =
    status === "Moved Out"
      ? moveOutDate || new Date().toISOString().split("T")[0]
      : null;

  return updateTenantStatusRecord(tenantId, status, finalMoveOutDate);
}

export async function fetchTenantInformation(tenantId) {
  return fetchTenantById(tenantId);
}
