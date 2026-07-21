import {
  createTenantAccount,
  fetchTenants,
  fetchTenantById,
  updateTenantPassword,
  changeTenantStatus,
} from "../service/tenantService.js";

function determineStatusCode(error) {
  const message = error?.message?.toLowerCase() ?? "";

  if (message.includes("not found")) {
    return 404;
  }

  if (
    message.includes("required") ||
    message.includes("invalid") ||
    message.includes("already") ||
    message.includes("only approved") ||
    message.includes("not available")
  ) {
    return 400;
  }

  return 500;
}

export async function createTenant(req, res) {
  try {
    const result = await createTenantAccount({
      ...req.body,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Tenant created successfully",
      data: result,
    });
  } catch (error) {
    return res.status(determineStatusCode(error)).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getTenants(req, res) {
  try {
    const tenants = await fetchTenants();

    return res.status(200).json({
      success: true,
      data: tenants,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getTenantById(req, res) {
  try {
    const tenant = await fetchTenantById(req.params.id);

    return res.status(200).json({
      success: true,
      data: tenant,
    });
  } catch (error) {
    return res.status(determineStatusCode(error)).json({
      success: false,
      message: error.message,
    });
  }
}

export async function changeTenantPassword(req, res) {
  try {
    const result = await updateTenantPassword(req.params.id, req.body.password);

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: result,
    });
  } catch (error) {
    return res.status(determineStatusCode(error)).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updateTenantStatus(req, res) {
  try {
    const result = await changeTenantStatus(
      req.params.id,
      req.body.status,
      req.body.moveOutDate,
    );

    return res.status(200).json({
      success: true,
      message: "Tenant status updated successfully",
      data: result,
    });
  } catch (error) {
    return res.status(determineStatusCode(error)).json({
      success: false,
      message: error.message,
    });
  }
}
