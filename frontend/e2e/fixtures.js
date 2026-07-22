export const rooms = [
  { id: "room-101", roomNumber: "101", monthlyRent: 6500, capacity: 2, status: "Available" },
  { id: "room-102", roomNumber: "102", monthlyRent: 7000, capacity: 2, status: "Occupied" },
];

export const requests = [
  { id: "inq-pending", name: "Pat Pending", email: "pat@example.com", contact: "09170000001", roomId: "room-101", roomNumber: "101", moveInDate: "2026-08-01", message: "Is this available?", status: "Pending" },
  { id: "inq-approved", name: "Ada Approved", email: "ada@example.com", contact: "09170000002", roomId: "room-101", roomNumber: "101", moveInDate: "2026-08-05", message: "Ready to move in", status: "Approved" },
];

export async function mockApi(page) {
  let inquiryRequests = structuredClone(requests);

  const handleApiRoute = async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const { pathname } = url;
    const method = request.method();
    let body;

    if (pathname === "/api/auth/login" && method === "POST") {
      const credentials = JSON.parse(request.postData() || "{}");
      const admin = String(credentials.identifier || credentials.email).includes("admin");
      body = admin
        ? { data: { token: "e2e-admin-token", user: { id: "admin-1", name: "Demo Admin", email: "admin.demo@spartment.local", role: "admin" } } }
        : { data: { token: "e2e-token", user: { id: "user-1", name: "Terry Tenant", email: "tenant@example.com", role: "tenant", tenantId: "tenant-1" } } };
    } else if (pathname === "/analytics") {
      body = { totalRevenue: 42000, occupancyRate: 75, paymentStatus: { paid: 8, pending: 2, overdue: 1 } };
    } else if (pathname === "/api/dashboard/metrics") {
      body = { data: { collectedRevenue: 42000, pendingPayments: 2, latePayments: 1 } };
    } else if (pathname === "/api/analytics") {
      body = { data: { totalRevenue:42000, forecastRevenue:52000, variance:-19.2, occupancyRate:50, totalTenants:2, revenueTrend:[{month:"2026-06",forecast:13000,actual:11000},{month:"2026-07",forecast:13000,actual:13000}], occupancy:{Occupied:1,Available:1}, paymentStatus:{Paid:2,Overdue:1}, tenantGrowth:[{month:"2026-06",count:1},{month:"2026-07",count:2}], recommendations:[{id:"rec-1",title:"Follow up on late payments",description:"Send a reminder.",priority:"High",status:"Active"}] } };
    } else if (pathname === "/api/rooms" || pathname === "/api/rooms/available") {
      body = { data: rooms };
    } else if (pathname === "/api/inquiries" && method === "GET") {
      body = { data: inquiryRequests };
    } else if (pathname.endsWith("/approve")) {
      const id = pathname.split("/").at(-2);
      inquiryRequests = inquiryRequests.map((item) => item.id === id ? { ...item, status: "Approved" } : item);
      body = { data: { id, status: "Approved" } };
    } else if (pathname.endsWith("/reject")) {
      const id = pathname.split("/").at(-2);
      inquiryRequests = inquiryRequests.map((item) => item.id === id ? { ...item, status: "Rejected" } : item);
      body = { data: { id, status: "Rejected" } };
    } else if (pathname === "/api/inquiries" && method === "POST") {
      body = { message: "Inquiry submitted successfully." };
    } else if (pathname === "/api/tenants" && method === "GET") {
      body = { data: [] };
    } else if (pathname === "/api/tenants" && method === "POST") {
      body = { data: { tenant: { id: "tenant-2", name: "Ada Approved", email: "ada@example.com", status: "Active" }, billing: { totalAmount: 6500, status: "Pending", dueDate: "2026-08-05" } } };
    } else if (pathname === "/api/tenants/tenant-1") {
      body = { tenant: { id: "tenant-1", fullName: "Terry Tenant", email: "terry@example.com", contact: "09170000003" }, room: rooms[0], billing: { dueDate: "2026-08-15" }, payments: [{ id: 1, amount: 6500, paymentDate: "2026-07-01", status: "Paid" }] };
    } else if (pathname === "/api/billing" && method === "GET") {
      body = { data: [{ id:"bill-1", billing_period:"2026-07-01", due_date:"2026-07-15", total_amount:6500, paid_amount:6500, remaining_balance:0, status:"Paid", tenants:{full_name:"Terry Tenant",email:"terry@example.com"}, rooms:{room_number:"101"}, utility:{electricity_amount:850,water_amount:220,internet_amount:0} }] };
    } else if (pathname === "/api/billing/bill-1/status" || pathname === "/api/billing/bill-1/utility") {
      body = { data: pathname.endsWith("utility") ? { electricity_amount:900, water_amount:250 } : { id:"bill-1", status:"Paid" } };
    } else if (pathname === "/api/billing/tenant/1") {
      body = { data: { rentAmount: 6500, waterBill: 300, electricityBill: 900, totalAmount: 7700, status: "Pending", payments: [{ id: 1, amount: 7700, paymentDate: "2026-07-01", status: "Paid" }] } };
    } else if (pathname === "/api/risk/high-risk") {
      body = { data: [{ id: "risk-1", tenantId: "tenant-9", riskLevel: "High", riskScore: 88, unpaidBalance: 13000, indicators: ["Two overdue payments"] }] };
    } else if (pathname === "/api/risk/tenant/tenant-1") {
      body = { data: { riskLevel: "Medium", riskScore: 45, indicators: ["One pending payment"] } };
    } else if (pathname === "/api/notifications" && method === "GET") {
      body = { data: [{ id: "notice-1", category: "Billing", message: "Rent is due soon", status: "Unread" }] };
    } else if (pathname === "/api/notifications/notice-1/read") {
      body = { data: { id: "notice-1", status: "Read" } };
    } else {
      return route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ message: `No E2E mock for ${method} ${pathname}` }) });
    }

    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
  };

  await page.route(/\/api\/(?!.*\.js(?:\?|$))/, handleApiRoute);
  await page.route("http://localhost:5000/analytics", handleApiRoute);
}
