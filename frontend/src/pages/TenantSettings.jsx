import { useState } from "react";
import TenantPortalNav from "../components/TenantPortalNav";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import useTenantPortal from "../hooks/useTenantPortal";

export default function TenantSettings() {
  const { tenantId, data, loading, error } = useTenantPortal();
  const [form, setForm] = useState({ current: "", password: "", confirm: "" });
  const [message, setMessage] = useState("");
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  const tenant = data?.tenant || {};
  const room = data?.room || {};
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault(); setMessage("");
    if (form.password !== form.confirm) return setMessage("New passwords do not match.");
    const response = await fetch(`/api/tenants/${tenantId}/password`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token") || ""}` }, body: JSON.stringify({ password: form.password, currentPassword: form.current }) });
    const result = await response.json().catch(() => ({}));
    setMessage(response.ok ? "Password updated successfully." : result.message || "Password update failed.");
  };
  const name = tenant.fullName || tenant.full_name || tenant.name || "Tenant";
  const email = tenant.email || tenant.user?.email || "Not available";
  const roomNumber = room.roomNumber || room.room_number || tenant.roomNumber || "Not assigned";
  return <div className="tenant-portal"><TenantPortalNav tenant={tenant} active="settings" /><main className="tenant-main tenant-settings">
    <section className="tenant-welcome"><h1>Settings</h1><p>Manage your account</p></section>
    <section className="tenant-card settings-card"><h2>Account</h2>{[["Name",name],["Email",email],["Room",roomNumber]].map(([label,value]) => <p key={label}><span>{label}</span><strong>{value}</strong></p>)}</section>
    <form className="tenant-card settings-card" onSubmit={submit}><h2>Change password</h2>{message && <div role="status" className="settings-message">{message}</div>}<label>Current password<input type="password" name="current" value={form.current} onChange={update} required /></label><label>New password<input type="password" name="password" value={form.password} onChange={update} minLength={8} required /></label><label>Confirm new password<input type="password" name="confirm" value={form.confirm} onChange={update} minLength={8} required /></label><button type="submit">Update password</button></form>
  </main></div>;
}
