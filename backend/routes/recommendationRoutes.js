import { Router } from "express";

import { getRecommendationsController } from "../controller/recommendationController.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Get Active Recommendations
|--------------------------------------------------------------------------
|
| GET
| /api/recommendation
|
| Returns:
|
| - priority
| - category
| - related tenant
| - related risk condition
|
|--------------------------------------------------------------------------
*/

router.get("/", getRecommendationsController);

export default router;
