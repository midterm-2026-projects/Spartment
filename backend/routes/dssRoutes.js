import express from "express";

import {} from "../controller/dssController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| DSS Dashboard
|--------------------------------------------------------------------------
|
| GET
| /api/dss
|
| Returns:
|
| - risk assessments
| - recommendations
| - risk indicators
|
|--------------------------------------------------------------------------
*/

router.get("/", getDSSDashboard);

/*
|--------------------------------------------------------------------------
| Refresh DSS
|--------------------------------------------------------------------------
|
| POST
| /api/dss/refresh
|
| Runs:
|
| Risk Analysis
|       |
|       ↓
| Recommendation Engine
|
|--------------------------------------------------------------------------
*/

router.post("/refresh", refreshDSS);

export default router;
