import axios from "axios";

const dashboardAPI = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || "/api"}/dashboard`,
});
dashboardAPI.interceptors.request.use((config) => { const token = localStorage.getItem("token"); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });

/*
==========================================
GET DASHBOARD METRICS
==========================================
GET
/api/dashboard/metrics
==========================================
*/

export async function getDashboardMetrics() {
  try {
    const response = await dashboardAPI.get("/metrics");

    return response.data?.data ?? response.data;
  } catch (error) {
    throw new Error("Failed to retrieve dashboard metrics.");
  }
}

/*
==========================================
GET DSS SUMMARY
==========================================
GET
/api/dashboard/dss
==========================================
*/

export async function getDSSSummary() {
  try {
    const response = await dashboardAPI.get("/dss");

    return response.data?.data ?? response.data;
  } catch (error) {
    throw new Error("Failed to retrieve DSS summary.");
  }
}

export default dashboardAPI;
