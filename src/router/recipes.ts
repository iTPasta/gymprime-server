import express from "express";

import { isAuthenticated, isAdmin } from "../middlewares";
import {
    deleteRecipe,
    getAllRecipes,
    getMyRecipes,
    getRecipe,
    makeRecipe,
    updateRecipe,
} from "../controllers/recipes";

export default (router: express.Router) => {
    router.get("/recipes/all", isAuthenticated, isAdmin, getAllRecipes);
    router.get("/recipes/:id", isAuthenticated, getRecipe);
    router.get("/recipes", isAuthenticated, getMyRecipes);
    router.post("/recipes", isAuthenticated, makeRecipe);
    router.put("/recipes/:id", isAuthenticated, updateRecipe);
    router.delete("/recipes/:id", isAuthenticated, deleteRecipe);
};
