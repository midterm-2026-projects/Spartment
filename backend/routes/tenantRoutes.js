import express from "express";

import {
  createTenant,
  changeTenantPassword,
} from "../controller/tenantController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Create Tenant
|--------------------------------------------------------------------------
*/

router.post("/", createTenant);

/*
|--------------------------------------------------------------------------
| Update Tenant Password
|--------------------------------------------------------------------------
*/

router.patch("/:id/password", changeTenantPassword);

export default router;
