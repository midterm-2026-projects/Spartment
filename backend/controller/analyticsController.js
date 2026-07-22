import { fetchAnalyticsData } from "../service/analyticsService.js";

export async function getAnalytics(req, res) {
  try {
    const analytics = await fetchAnalyticsData();

    return res.status(200).json({
      success: true,

      data: analytics,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}
