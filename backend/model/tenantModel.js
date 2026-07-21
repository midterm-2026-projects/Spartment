/*
|--------------------------------------------------------------------------
| Tenant Model
|--------------------------------------------------------------------------
| Responsible for:
| - storing tenant records
| - retrieving tenant information
| - updating tenant information
|
| No business logic here.
|--------------------------------------------------------------------------
*/

let tenants = [];

/*
|--------------------------------------------------------------------------
| Create Tenant
|--------------------------------------------------------------------------
*/

export async function createTenant(tenantData) {
  const newTenant = {
    id: tenants.length + 1,

    fullName: tenantData.fullName,

    email: tenantData.email,

    contact: tenantData.contact,

    room: tenantData.room,

    username: tenantData.username,

    password: tenantData.password,

    status: "Active",

    createdAt: new Date(),
  };

  tenants.push(newTenant);

  return newTenant;
}

/*
|--------------------------------------------------------------------------
| Get All Tenants
|--------------------------------------------------------------------------
*/

export async function getTenants() {
  return tenants;
}

/*
|--------------------------------------------------------------------------
| Get Tenant By ID
|--------------------------------------------------------------------------
*/

export async function getTenantById(tenantId) {
  return tenants.find((tenant) => tenant.id == tenantId);
}

/*
|--------------------------------------------------------------------------
| Get Tenant By Email
|--------------------------------------------------------------------------
*/

export async function getTenantByEmail(email) {
  return tenants.find((tenant) => tenant.email === email);
}

/*
|--------------------------------------------------------------------------
| Update Tenant Password
|--------------------------------------------------------------------------
*/

export async function updateTenantPassword(tenantId, password) {
  const tenant = tenants.find((item) => item.id == tenantId);

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  tenant.password = password;

  return tenant;
}

/*
|--------------------------------------------------------------------------
| Reset Tenant Records
|--------------------------------------------------------------------------
| Used for testing
|--------------------------------------------------------------------------
*/

export async function resetTenants() {
  tenants = [];
}
