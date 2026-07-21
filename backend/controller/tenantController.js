import {
  createTenantAccount,
  updateTenantPassword,
} from "../service/tenantService.js";

import { generateBilling } from "../service/billingService.js";

/*
|--------------------------------------------------------------------------
| Create Tenant Account
|--------------------------------------------------------------------------
| Creates tenant then automatically generates
| initial billing record.
|--------------------------------------------------------------------------
*/

export const createTenant = async (req, res) => {
  try {
    // Create tenant first
    const tenant = await createTenantAccount(req.body);

    // Generate initial billing
    const billing = await generateBilling({
      tenantId: tenant.id,

      billingType: "initial",
    });

    res.status(201).json({
      message: "Tenant created successfully",

      data: {
        tenant,

        billing,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Change Tenant Password
|--------------------------------------------------------------------------
*/

export const changeTenantPassword = async (req, res) => {
  try {
    const tenant = await updateTenantPassword(
      req.params.id,

      req.body.password,
    );

    res.status(200).json({
      message: "Password updated successfully",

      data: tenant,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
