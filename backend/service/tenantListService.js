import { getTenantList } from "../model/tenantListModel.js";

export async function fetchTenantList() {
  try {
    const tenants = await getTenantList();

    return tenants;
  } catch (error) {
    throw new Error("Failed to retrieve tenant list.");
  }
}