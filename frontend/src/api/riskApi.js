import axios from "axios";

const riskAPI = axios.create({
  baseURL: "http://localhost:5000/api/risk",
});

/*
==========================================
GET TENANT RISK
==========================================
*/

export async function fetchTenantRisk(tenantId) {
  try {
    const response = await riskAPI.get(`/tenant/${tenantId}`);

    return response.data;
  } catch (error) {
    throw new Error("Failed to retrieve tenant risk.");
  }
}

/*
==========================================
GET HIGH RISK TENANTS
==========================================
*/

export async function fetchHighRiskTenants() {
  try {
    const response = await riskAPI.get("/high-risk");

    return response.data;
  } catch (error) {
    throw new Error("Failed to retrieve high risk tenants.");
  }
}

export default riskAPI;
