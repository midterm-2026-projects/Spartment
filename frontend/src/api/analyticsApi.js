export async function getAnalytics() {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "/api"}/analytics`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || "Failed to retrieve analytics information.");
  return result?.data || result;
}
