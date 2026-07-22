import "./App.css";
import { useState } from "react";
import { login } from "./api/authApi";

import Header from "./components/Header";
import TextField from "./components/TextField";
import Button from "./components/Button";
import AdminNotificationDashboard from "./pages/AdminNotificationDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import BillingDashboard from "./pages/BillingDashboard";
import CustomerRequests from "./pages/CustomerRequests";
import FinancialDashboard from "./pages/FinancialDashboard";
import GuestRooms from "./pages/GuestRooms";
import RevenueDashboard from "./pages/RevenueDashboard";
import RiskDashboard from "./pages/RiskDashboard";
import TenantDashboard from "./pages/TenantDashboard";
import TenantBillingPortal from "./pages/TenantBillingPortal";
import TenantSettings from "./pages/TenantSettings";
import TenantNotificationDashboard from "./pages/TenantNotificationDashboard";
import CustomerServiceAssistant from "./components/CustomerServiceAssistant";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRooms from "./pages/AdminRooms";
import AdminTenants from "./pages/AdminTenants";

const routes = {
  "/admin": AdminDashboard,
  "/admin/rooms": AdminRooms,
  "/admin/tenants": AdminTenants,
  "/admin/notifications": AdminNotificationDashboard,
  "/analytics": AnalyticsDashboard,
  "/billing": BillingDashboard,
  "/customer-requests": CustomerRequests,
  "/financial": FinancialDashboard,
  "/rooms": GuestRooms,
  "/revenue": RevenueDashboard,
  "/risk": RiskDashboard,
  "/tenant-creation": AdminTenants,
  "/tenant": TenantDashboard,
  "/tenant/billing": TenantBillingPortal,
  "/tenant/settings": TenantSettings,
  "/tenant/notifications": TenantNotificationDashboard,
};

function SignIn() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async () => {
    try {
      setSubmitting(true); setError("");
      const session = await login(credentials.email, credentials.password);
      localStorage.setItem("token", session.token);
      localStorage.setItem("user", JSON.stringify({ ...session.user, authToken: session.token }));
      if (session.user?.tenantId) localStorage.setItem("tenantId", session.user.tenantId);
      window.location.assign(String(session.user?.role).toLowerCase() === "tenant" ? "/tenant" : "/admin");
    } catch (reason) {
      setError(reason.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="landing-page">
      <section className="welcome-panel">
        <Header />

        <div className="welcome-panel__content">
          <p className="eyebrow"><span aria-hidden="true">✦</span> Smarter apartment living</p>
          <h1>Everything your property needs, in one place.</h1>
          <p className="welcome-panel__lead">
            Keep owners and tenants connected—from rooms and residents to
            monthly bills, requests, and reports.
          </p>

          <div className="feature-list" aria-label="Platform highlights">
            <article className="feature-card">
              <span className="feature-card__icon" aria-hidden="true">▦</span>
              <span><strong>Rooms &amp; tenants</strong><small>Keep every unit and resident organized.</small></span>
            </article>
            <article className="feature-card">
              <span className="feature-card__icon" aria-hidden="true">₱</span>
              <span><strong>Rent &amp; utilities</strong><small>Track payments and monthly bills with ease.</small></span>
            </article>
            <article className="feature-card">
              <span className="feature-card__icon" aria-hidden="true">↗</span>
              <span><strong>Clear overview</strong><small>See how your property is doing at a glance.</small></span>
            </article>
          </div>
        </div>

        <p className="welcome-panel__footer">© 2026 Spartment. All rights reserved.</p>
        <span className="decor decor--one" aria-hidden="true" />
        <span className="decor decor--two" aria-hidden="true" />
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-card__heading">
            <p className="auth-card__kicker">Welcome back</p>
            <h2>Sign in</h2>
            <p>Access your Spartment dashboard</p>
          </div>

          <form onSubmit={(event) => { event.preventDefault(); handleSubmit(); }}>
            <TextField onChange={setCredentials} />
            {error && <p className="auth-error" role="alert">{error}</p>}
            <Button
              onSubmit={handleSubmit}
              onGuest={() => window.location.assign("/rooms")}
            />
            {submitting && <span className="auth-loading" role="status">Signing in…</span>}
          </form>

          <aside className="demo-card">
            <strong>Demo accounts</strong>
            <p><code>tenant.demo@spartment.local</code><span>Tenant</span></p>
            <p><code>TenantDemo123!</code><span>Password</span></p>
            <small>This account uses an actual tenant record.</small>
            <p><code>admin.demo@spartment.local</code><span>Admin</span></p>
            <p><code>AdminDemo123!</code><span>Password</span></p>
          </aside>
        </div>
        <p className="auth-panel__note">Secure property management, made simple.</p>
      </section>
    </main>
  );
}

function App() {
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  })();
  const isAdmin = String(storedUser?.role || "").toLowerCase() === "admin";
  if (!localStorage.getItem("token") && storedUser?.authToken) localStorage.setItem("token", storedUser.authToken);
  const requestedAdminPage = window.location.pathname === "/admin" || window.location.pathname.startsWith("/admin/") || window.location.pathname === "/tenant-creation" || window.location.pathname === "/billing" || window.location.pathname === "/customer-requests" || window.location.pathname === "/analytics";
  const Page = window.location.pathname === "/rooms" && isAdmin
    ? AdminRooms
    : routes[window.location.pathname];
  let content;

  if (requestedAdminPage && !isAdmin) {
    content = <SignIn />;
  } else if (Page) {
    content = <Page />;
  } else if (window.location.pathname !== "/") {
    content = (
      <main>
        <h1>Page not found</h1>
        <a href="/">Return to sign in</a>
      </main>
    );
  } else {
    content = <SignIn />;
  }

  const isAdminPage = requestedAdminPage || (window.location.pathname === "/rooms" && isAdmin);
  return <>{content}{!isAdminPage && <CustomerServiceAssistant />}</>;
}

export default App;
