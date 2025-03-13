import express from "express";
import { getCategoryShow, getCategoryShowList, getDetailShow, getSimilarShow, getTrailerShow, getTrendingShow } from "../controllers/tvShow.controller.js";


const router = express.Router();

router.get("/trending", getTrendingShow)
router.get("/:id/trailer", getTrailerShow)
router.get("/:id/details", getDetailShow)
router.get("/:id/similar", getSimilarShow)
router.get("/:category", getCategoryShow)
router.get("/genre/:genreName", getCategoryShowList)

export default router;

