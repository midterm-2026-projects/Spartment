import {
  generateBilling,
  getBillingByTenant,
  getAllBilling,
  updateBillingStatus,
} from "../service/billingService.js";

/*
|--------------------------------------------------------------------------
| Generate Initial / Monthly Billing
|--------------------------------------------------------------------------
*/
export const createBilling = async (req, res) => {
  try {
    const { tenantId, billingType } = req.body;

    if (!tenantId) {
      return res.status(400).json({
        success: false,

        message: "Tenant ID is required.",
      });
    }

    const billing = await generateBilling({
      tenantId,

      billingType: billingType || "initial",
    });

    return res.status(201).json({
      success: true,

      message: "Billing generated successfully.",

      data: billing,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Tenant Billing History
|--------------------------------------------------------------------------
*/
export const getTenantBilling = async (req, res) => {
  try {
    const { tenantId } = req.params;

    if (!tenantId) {
      return res.status(400).json({
        success: false,

        message: "Tenant ID is required.",
      });
    }

    const billing = await getBillingByTenant(tenantId);

    return res.status(200).json({
      success: true,

      data: billing,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get All Billing Records
|--------------------------------------------------------------------------
*/
export const getBillingRecords = async (req, res) => {
  try {
    const billing = await getAllBilling();

    return res.status(200).json({
      success: true,

      data: billing,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update Billing Payment Status
|--------------------------------------------------------------------------
*/
export const updateBillingPaymentStatus = async (req, res) => {
  try {
    const { billingId } = req.params;

    const { status } = req.body;

    if (!billingId || !status) {
      return res.status(400).json({
        success: false,

        message: "Billing ID and status are required.",
      });
    }

    const updatedBilling = await updateBillingStatus(
      billingId,

      status,
    );

    return res.status(200).json({
      success: true,

      message: "Billing status updated successfully.",

      data: updatedBilling,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
