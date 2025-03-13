import express from "express";
import { getTrailerMovie, getTrendingMovies, getDetailsMovie, getSimilarMovie, getCategoryMovie, getGenre, getCategoryList } from "../controllers/movie.controller.js";

const router = express.Router();

router.get("/trending", getTrendingMovies)
router.get("/:id/trailer", getTrailerMovie)
router.get("/:id/details", getDetailsMovie)
router.get("/:id/similar", getSimilarMovie)
router.get("/:category", getCategoryMovie)
router.get("/genreList", getGenre)
router.get("/genre/:genreName", getCategoryList)


export default router;

