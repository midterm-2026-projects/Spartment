const API_URL = `${import.meta.env.VITE_API_BASE_URL || "/api"}/billing`;

const headers = (json = false) => ({
  ...(json ? { "Content-Type": "application/json" } : {}),
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

async function request(url, options = {}, fallback) {
  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new Error(fallback);
  }
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || fallback);
  return result;
}

export const getAllBilling = () => request(API_URL, { headers: headers() }, "Failed to retrieve billing information.");
export const getBillingById = (id) => request(`${API_URL}/${id}`, { headers: headers() }, "Failed to retrieve billing.");
export const getTenantBilling = (tenantId) => request(`${API_URL}/tenant/${tenantId}`, { headers: headers() }, "Failed to retrieve billing information.");
export const generateBilling = (data) => request(API_URL, { method:"POST", headers:headers(true), body:JSON.stringify(data) }, "Failed to generate billing.");
export const updateBillingStatus = (id,status) => request(`${API_URL}/${id}/status`, { method:"PATCH", headers:headers(true), body:JSON.stringify({status}) }, "Failed to update billing status.");
export const saveUtilityBilling = (id,data) => request(`${API_URL}/${id}/utility`, { method:"PATCH", headers:headers(true), body:JSON.stringify(data) }, "Failed to save utility billing.");
