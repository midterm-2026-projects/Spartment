import {
  getAllRecommendations,
  saveRecommendations,
} from "../service/recommendationService.js";

export async function getRecommendationsController(req, res) {
  try {
    const recommendations = await getAllRecommendations();

    return res.status(200).json({
      success: true,

      data: recommendations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}

export async function generateRecommendationController(req, res) {
  try {
    const result = await saveRecommendations();

    return res.status(201).json({
      success: true,

      message: "Recommendations generated successfully.",

      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}
