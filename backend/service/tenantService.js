import { getTenantInformation } from "../model/tenantModel.js";

export async function fetchTenantInformation(id) {
  try {
    const tenantInformation = await getTenantInformation(id);

    return tenantInformation;
  } catch (error) {
    throw new Error(error.message);
  }
}