import axios from "axios";

const API_URL = "http://localhost:5000/api/dashboard";

export async function getDashboardMetrics() {
  try {
    const response = await axios.get(`${API_URL}/metrics`);

    /*
    MSW:

    {
      success:true,
      data:{
        collectedRevenue:50000
      }
    }

    return:

    {
      collectedRevenue:50000
    }

    */

    return response.data?.data ?? response.data;
  } catch (error) {
    throw new Error("Failed to retrieve dashboard metrics.");
  }
}
