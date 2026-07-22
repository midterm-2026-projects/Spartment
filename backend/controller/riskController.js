import {
  analyzeTenantRisk,
  getHighRiskTenants,
  generateRiskAssessment,
} from "../service/riskService.js";

export const analyzeTenantRiskController = async (req, res) => {
  try {
    const { tenantId } = req.params;

    if (!tenantId) {
      return res.status(400).json({
        message: "Tenant ID is required.",
      });
    }

    const risk = await analyzeTenantRisk(tenantId);

    return res.status(200).json({
      success: true,

      data: risk,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const generateRiskController = async (req, res) => {
  try {
    const result = await generateRiskAssessment();

    return res.status(201).json({
      success: true,

      message: "Risk assessments generated successfully.",

      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getHighRiskTenantList = async (req, res) => {
  try {
    const tenants = await getHighRiskTenants();

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
};
