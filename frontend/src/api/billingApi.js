import axios from "axios";

const API_URL = "http://localhost:5000/api/billing";

/*
==========================================
GET ALL BILLING
==========================================
*/

export async function getAllBilling() {
  try {
    const response = await axios.get(API_URL);

    return response.data;
  } catch (error) {
    throw new Error("Failed to retrieve billing information.");
  }
}

/*
==========================================
GET TENANT BILLING
==========================================
GET /api/billing/tenant/:tenantId
==========================================
*/

export async function getTenantBilling(tenantId) {
  try {
    const response = await axios.get(`${API_URL}/tenant/${tenantId}`);

    return response.data;
  } catch (error) {
    throw new Error("Failed to retrieve billing information.");
  }
}

/*
==========================================
GENERATE BILLING
==========================================
*/

export async function generateBilling(billingData) {
  try {
    const response = await axios.post(
      `${API_URL}/generate`,

      billingData,
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to generate billing.");
  }
}

/*
==========================================
UPDATE BILLING STATUS
==========================================
*/

export async function updateBillingStatus(
  billingId,

  status,
) {
  try {
    const response = await axios.patch(
      `${API_URL}/${billingId}/status`,

      {
        status,
      },
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to update billing status.");
  }
}
