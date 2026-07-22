import TenantPortalNav from "../components/TenantPortalNav";
import PaymentHistory from "../components/PaymentHistory";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import useTenantPortal from "../hooks/useTenantPortal";
import { useTenantRisk } from "../hooks/useRiskAnalysis";
import RiskStatusCard from "../components/RiskStatusCard";
import RiskIndicatorList from "../components/RiskIndicatorList";

const money = (value) => `₱${Number(value || 0).toLocaleString()}`;
const billMoney = (value) => `₱${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

export default function TenantDashboard({ tenantId }) {
  const { data, loading, error } = useTenantPortal(tenantId);
  const { risk, loading: riskLoading } = useTenantRisk(tenantId);
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  const tenant = data?.tenant || {};
  const room = data?.room || {};
  const billing = data?.billing || {};
  const payments = data?.payments || [];
  const name = tenant.fullName || tenant.full_name || tenant.name || "Tenant";
  const roomNumber = room.roomNumber || room.room_number || tenant.roomNumber || "Not assigned";
  const rent = room.monthlyRent ?? room.monthly_rent ?? billing.rentAmount ?? billing.rent_amount ?? 0;
  const due = billing.dueDate || billing.due_date || billing.nextDue || "No current bill";
  const total = billing.totalAmount ?? billing.total_amount ?? rent;
  const status = billing.status || "Pending";

  return <div className="tenant-portal">
    <TenantPortalNav tenant={tenant} active="dashboard" />
    <main className="tenant-main">
      <section className="tenant-welcome"><h1>Hello, {name.split(" ")[0]} <span>👋</span></h1><p>Here&apos;s a snapshot of your apartment.</p></section>
      <section className="tenant-summary">
        <article><i className="blue">⌂</i><p>My Room</p><strong>{roomNumber}</strong></article>
        <article><i className="green">▣</i><p>Monthly Rent</p><strong>{money(rent)}</strong></article>
        <article><i className="yellow">□</i><p>Next Due</p><strong>{due}</strong></article>
      </section>
      <section className="tenant-card tenant-profile-summary"><h2>Tenant information</h2><p><span>Email</span><strong>{tenant.email || "Not provided"}</strong></p><p><span>Contact</span><strong>{tenant.contact || tenant.phone || "Not provided"}</strong></p></section>
      <section className="current-bill tenant-card">
        <div><h2>Current bill</h2><small>{billing.period || "Latest statement"}</small></div>
        <span className={`tenant-status ${status.toLowerCase()}`}>● {status}</span>
        <div className="current-bill__amount"><p>Amount due<strong>{billMoney(total)}</strong></p><p>Due date<strong>{`Due ${due}`}</strong></p></div>
        <p className="tenant-tip">💡 Payments are processed offline. Please coordinate with the building admin.</p>
      </section>
      <section className="tenant-card tenant-history"><PaymentHistory payments={payments} /></section>
      {riskLoading ? <p>Loading risk analysis…</p> : risk ? <section className="tenant-risk"><h2>{risk.riskLevel || risk.risk_level}</h2><RiskStatusCard risk={risk} /><RiskIndicatorList indicators={risk.indicators || []} /></section> : null}
    </main>
  </div>;
}
