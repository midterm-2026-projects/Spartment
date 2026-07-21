import {
  getTenants,
  createTenant,
  updateTenantPassword as updatePassword,
  getTenantById,
  getTenantByEmail,
} from "../model/tenantModel.js";

import { generateBilling } from "./billingService.js";

/*
|--------------------------------------------------------------------------
| Create Tenant Account
|--------------------------------------------------------------------------
| Workflow:
|
| Create Tenant
|       |
|       ↓
| Generate Initial Billing
|       |
|       ↓
| Return Tenant + Billing
|
|--------------------------------------------------------------------------
*/

export async function createTenantAccount(tenantData) {
  try {
    const existingTenant = await getTenantByEmail(tenantData.email);

    if (existingTenant) {
      throw new Error("Tenant already exists.");
    }

    /*
    -----------------------------
    Create Tenant Account
    -----------------------------
    */

    const tenant = await createTenant({
      fullName: tenantData.fullName,

      email: tenantData.email,

      contact: tenantData.contact,

      room: tenantData.room,

      username: tenantData.username,

      password: tenantData.password,
    });

    /*
    -----------------------------
    Generate Initial Billing
    -----------------------------
    */

    const billing = await generateBilling({
      tenantId: tenant.id,

      billingType: "initial",
    });

    return {
      tenant,

      billing,
    };
  } catch (error) {
    throw new Error(error.message);
  }

  return tenant;
}

/*
|--------------------------------------------------------------------------
| Fetch Tenant Information
|--------------------------------------------------------------------------
*/

export async function fetchTenantInformation(id) {
  const tenant = await getTenantById(id);

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  return tenant;
}

/*
|--------------------------------------------------------------------------
| Find Tenant By Name
|--------------------------------------------------------------------------
*/

export async function findTenantByName(name) {
  const tenants = await getTenants();

  const tenant = tenants.find(
    (item) => item.fullName?.toLowerCase() === name.toLowerCase(),
  );

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  return tenant;
}

/*
|--------------------------------------------------------------------------
| Update Tenant Password
|--------------------------------------------------------------------------
*/

export async function updateTenantPassword(id, password) {
  try {
    const tenant = await updatePassword(
      id,

      password,
    );

    return tenant;
  } catch (error) {
    throw new Error(error.message);
  }
}
