import {
  getTenantInformation,
  searchTenantByName,
} from "../model/tenantModel.js";

import {
  validateTenantId,
  validateTenantName,
} from "../validation/tenantValidation.js";

export async function fetchTenantInformation(id) {
  try {
    validateTenantId(id);

    return await getTenantInformation(id);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function findTenantByName(name) {
  try {
    validateTenantName(name);

    return await searchTenantByName(name);
  } catch (error) {
    throw new Error(error.message);
  }
}