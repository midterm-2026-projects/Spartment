import { useEffect, useState } from "react";
import { getTenantInformation } from "../api/tenantApi";

export function getStoredTenantId() {
  const direct = localStorage.getItem("tenantId");
  if (direct) return direct;
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.tenantId ?? user.tenant_id ?? user.tenant?.id ?? "";
  } catch {
    return "";
  }
}

export default function useTenantPortal(providedTenantId) {
  const tenantId = providedTenantId ?? getStoredTenantId();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    if (!tenantId) {
      setError("Tenant ID was not found. Please sign in again.");
      setLoading(false);
      return () => { active = false; };
    }
    getTenantInformation(tenantId)
      .then((response) => {
        if (!active) return;
        const value = response?.data ?? response ?? {};
        setData({
          tenant: value.tenant ?? value ?? {},
          room: value.room ?? value.tenant?.room ?? {},
          billing: value.billing ?? value.currentBilling ?? {},
          payments: value.payments ?? value.paymentHistory ?? [],
          rentStatements: value.rentStatements ?? value.rent_statements ?? [],
          utilityStatements: value.utilityStatements ?? value.utility_statements ?? [],
        });
      })
      .catch((reason) => active && setError(reason.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [tenantId]);

  return { tenantId, data, loading, error };
}
