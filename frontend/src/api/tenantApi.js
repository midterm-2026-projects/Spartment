import { fetchTenantInformation } from "../../../backend/service/tenantService.js";

export async function getTenantInformation(tenantId) {
  try {
    const tenant = await fetchTenantInformation(tenantId);

    return tenant;
  } catch (error) {
    throw new Error(error.message);
  }
}