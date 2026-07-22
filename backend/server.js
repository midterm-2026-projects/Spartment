import express from "express";

import roomRoutes from "./routes/roomRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import tenantRoutes from "./routes/tenantRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ success: true });
});

app.use("/api/inquiries", inquiryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/recommendation", recommendationRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ success: false, message: "Internal server error." });
});

app.listen(port, () => {
  console.log(`Spartment API listening on http://localhost:${port}`);
});
