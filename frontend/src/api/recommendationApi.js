import axios from "axios";

const recommendationAPI = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || "/api"}/recommendation`,
});
recommendationAPI.interceptors.request.use((config) => { const token = localStorage.getItem("token"); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });

/*
==========================================
GET ACTIVE RECOMMENDATIONS
==========================================
GET
/api/recommendation
==========================================
*/

export async function fetchRecommendations() {
  try {
    const response = await recommendationAPI.get("/");

    return response.data?.data ?? response.data;
  } catch (error) {
    throw new Error("Failed to retrieve recommendations.");
  }
}

/*
==========================================
GENERATE NEW RECOMMENDATIONS
==========================================
POST
/api/recommendation/generate
==========================================
*/

export async function generateRecommendations() {
  try {
    const response = await recommendationAPI.post("/generate");

    return response.data?.data ?? response.data;
  } catch (error) {
    throw new Error("Failed to generate recommendations.");
  }
}

/*
==========================================
REFRESH RECOMMENDATIONS
==========================================
POST
/api/recommendation/refresh
==========================================
*/

export async function refreshRecommendations() {
  try {
    const response = await recommendationAPI.post("/refresh");

    return response.data?.data ?? response.data;
  } catch (error) {
    throw new Error("Failed to refresh recommendations.");
  }
}

export default recommendationAPI;
