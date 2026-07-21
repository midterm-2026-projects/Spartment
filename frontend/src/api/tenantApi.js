import axios from "axios";

const API_URL = "http://localhost:5000/api/tenant";

export async function getTenantInformation(tenantId) {
  try {
    const response = await axios.get(`${API_URL}/${tenantId}`);

    return response.data;
  } catch (error) {
    throw new Error("Something went wrong.");
  }
}
