import axios from "axios";

const riskAPI = axios.create({
  baseURL: "http://localhost:5000/api/risk",
});

/*
|--------------------------------------------------------------------------
| Get Tenant Risk Analysis
|--------------------------------------------------------------------------
|
| Retrieves:
| - Risk level
| - Risk indicators
| - Late payments
| - Unpaid balance
|
|--------------------------------------------------------------------------
*/

export const fetchTenantRisk = async (tenantId) => {
  const response = await riskAPI.get(`/tenant/${tenantId}`);

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Get High Risk Tenants
|--------------------------------------------------------------------------
|
| Retrieves tenants classified as High Risk
|
|--------------------------------------------------------------------------
*/

export const fetchHighRiskTenants = async () => {
  const response = await riskAPI.get("/high-risk");

  return response.data;
};

export default riskAPI;
