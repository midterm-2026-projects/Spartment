import { getTenants } from "./tenantModel.js";

/*
|--------------------------------------------------------------------------
| Tenant List Model
|--------------------------------------------------------------------------
| Compatibility wrapper around tenantModel.js.
|--------------------------------------------------------------------------
*/

export async function getTenantList() {
  return getTenants();
}
