import TenantPortalNav from "../components/TenantPortalNav";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import useTenantPortal from "../hooks/useTenantPortal";

const money = (value) => `₱${Number(value || 0).toLocaleString()}`;
const status = (value = "Pending") => <span className={`tenant-status ${String(value).toLowerCase()}`}>● {value}</span>;

export default function TenantBillingPortal() {
  const { data, loading, error } = useTenantPortal();
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  const tenant = data?.tenant || {};
  const billing = data?.billing || {};
  const payments = data?.payments || [];
  const rentStatements = data?.rentStatements || [];
  const utilityStatements = data?.utilityStatements || [];
  const electricity = billing.electricityBill ?? billing.electricity_bill ?? 0;
  const water = billing.waterBill ?? billing.water_bill ?? 0;
  const rents = rentStatements.length ? rentStatements : payments.map((item) => ({ period: item.period || item.month || item.paymentDate || item.payment_date || "Payment", dueDate: item.dueDate || item.due_date || "—", amount: item.amount, status: item.status || item.verification_status }));
  return <div className="tenant-portal"><TenantPortalNav tenant={tenant} active="billing" /><main className="tenant-main">
    <section className="tenant-welcome"><h1>My Billing</h1><p>Your rent and utility statements</p></section>
    <section className="tenant-summary"><article><i className="yellow">ϟ</i><p>Electricity · Current</p><strong>{money(electricity)}</strong></article><article><i className="blue">♧</i><p>Water · Current</p><strong>{money(water)}</strong></article><article><i className="green">▣</i><p>Combined utilities</p><strong>{money(Number(electricity) + Number(water))}</strong></article></section>
    <StatementTable title="Rent statements" columns={["Period", "Due", "Amount", "Status"]} rows={rents.map((item) => [item.period, item.dueDate, money(item.amount), status(item.status)])} />
    <StatementTable title="Utility statements" columns={["Period", "Due", "Electricity", "Water", "Total", "Status"]} rows={utilityStatements.map((item) => [item.period, item.dueDate, money(item.electricity), money(item.water), money(item.total), status(item.status)])} />
  </main></div>;
}

function StatementTable({ title, columns, rows }) {
  return <section className="tenant-table tenant-card"><h2>{title}</h2><div className="tenant-table__scroll"><table><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{rows.length ? rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>) : <tr><td colSpan={columns.length}>No statements found.</td></tr>}</tbody></table></div></section>;
}
