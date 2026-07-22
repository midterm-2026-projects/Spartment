import axios from "axios";

const riskAPI = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || "/api"}/risk`,
});

/*
==========================================
GET TENANT RISK ASSESSMENT
==========================================
GET
/api/risk/tenant/:tenantId
==========================================
*/

export async function fetchTenantRisk(tenantId) {
  try {
    const response = await riskAPI.get(`/tenant/${tenantId}`);

    return response.data?.data ?? response.data;
  } catch (error) {
    throw new Error("Failed to retrieve tenant risk.");
  }
}

/*
==========================================
GET HIGH RISK TENANTS
==========================================
GET
/api/risk/high-risk
==========================================
*/

export async function fetchHighRiskTenants() {
  try {
    const response = await riskAPI.get("/high-risk");

    return response.data?.data ?? response.data;
  } catch (error) {
    throw new Error("Failed to retrieve high risk tenants.");
  }
}

/*
==========================================
GET ALL RISK ASSESSMENTS
==========================================
GET
/api/risk
==========================================
*/

export async function fetchRiskAssessments() {
  try {
    const response = await riskAPI.get("/");

    return response.data?.data ?? response.data;
  } catch (error) {
    throw new Error("Failed to retrieve risk assessments.");
  }
}

/*
==========================================
REFRESH TENANT RISK
==========================================
POST
/api/risk/refresh/:tenantId
==========================================
*/

export async function refreshTenantRisk(tenantId) {
  try {
    const response = await riskAPI.post(`/refresh/${tenantId}`);

    return response.data?.data ?? response.data;
  } catch (error) {
    throw new Error("Failed to refresh tenant risk.");
  }
}

export default riskAPI;
