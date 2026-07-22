import {
  generateBilling,
  getBillingByTenant,
  fetchBillingInformation,
  updateBillingPaymentStatus,
  fetchBillingById,
} from "../service/billingService.js";

/*
|--------------------------------------------------------------------------
| Create Billing
|--------------------------------------------------------------------------
*/

export const createBilling = async (req, res) => {
  try {
    const billing = await generateBilling(req.body);

    return res.status(201).json({
      success: true,

      message: "Billing created successfully.",

      data: billing,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get All Billing
|--------------------------------------------------------------------------
*/

export const getBillingRecords = async (req, res) => {
  try {
    const billing = await fetchBillingInformation();

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
| Get Billing By ID
|--------------------------------------------------------------------------
*/

export const getBilling = async (req, res) => {
  try {
    const billing = await fetchBillingById(req.params.id);

    return res.status(200).json({
      success: true,

      data: billing,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Tenant Billing History
|--------------------------------------------------------------------------
*/

export const getTenantBilling = async (req, res) => {
  try {
    const billing = await getBillingByTenant(req.params.tenantId);

    return res.status(200).json({
      success: true,

      data: billing,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update Billing Status
|--------------------------------------------------------------------------
*/

export const updateBillingStatus = async (req, res) => {
  try {
    const updatedBilling = await updateBillingPaymentStatus(
      req.params.id,

      req.body.status,
    );

    return res.status(200).json({
      success: true,

      message: "Billing status updated.",

      data: updatedBilling,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};
