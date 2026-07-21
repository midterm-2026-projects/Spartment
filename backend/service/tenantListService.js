import { getTenantList } from "../model/tenantListModel.js";

/*
|--------------------------------------------------------------------------
| Fetch Tenant List
|--------------------------------------------------------------------------
| Compatibility service for existing modules that use tenantListService.
|--------------------------------------------------------------------------
*/

export async function fetchTenantList() {
  const tenants = await getTenantList();

  return tenants ?? [];
}
