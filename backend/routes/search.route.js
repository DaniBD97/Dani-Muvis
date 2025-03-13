import express from "express";
import { addToFavorite, addToSearchHistory, getFavoriteList, getHistorial, removeFromFavorite, removeFromHistorial, searchActor, searchMovie, searchTvshow } from "../controllers/search.controller.js";


const router = express.Router();

router.get("/actor/:query", searchActor);
router.get("/movie/:query", searchMovie);
router.get("/tv/:query", searchTvshow);

router.get("/historial", getHistorial);
router.get("/favoriteList", getFavoriteList);

router.post("/history", addToSearchHistory);
router.post("/favorite", addToFavorite);

router.delete("/historial/:id", removeFromHistorial);
router.delete("/favorites/:id", removeFromFavorite);

export default router;