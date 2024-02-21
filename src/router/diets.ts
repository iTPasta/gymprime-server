import express from "express";

import {
    deleteDiet,
    getAllDiets,
    getDiet,
    getMyDiets,
    makeDiet,
    updateDiet,
} from "../controllers/diets";
import { isAuthenticated, isAdmin } from "../middlewares";

export default (router: express.Router) => {
    router.get("/diets/all", isAuthenticated, isAdmin, getAllDiets);
    router.get("/diets/:id", isAuthenticated, getDiet);
    router.get("/diets", isAuthenticated, getMyDiets);
    router.post("/diets", isAuthenticated, makeDiet);
    router.put("/diets/:id", isAuthenticated, updateDiet);
    router.delete("/diets/:id", isAuthenticated, deleteDiet);
};
