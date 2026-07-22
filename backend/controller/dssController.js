import {
  getDSSDashboard,
  refreshDSSData,
} from "../service/dssRefreshService.js";

export const getDSSDashboardController = async (req, res) => {
  try {
    const data = await getDSSDashboard();

    return res.status(200).json({
      success: true,

      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const refreshDSSController = async (req, res) => {
  try {
    const result = await refreshDSSData();

    return res.status(200).json({
      success: true,

      message: "DSS refreshed successfully.",

      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
