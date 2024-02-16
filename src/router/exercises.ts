import express from "express";

import { isAdmin, isAuthenticated } from "../middlewares";
import {
    deleteExercise,
    getAllExercises,
    getExercise,
    makeExercise,
    updateExercise,
} from "../controllers/exercises";

export default (router: express.Router) => {
    router.get("/exercises/all", isAuthenticated, getAllExercises);
    router.get("/exercises/:id", isAuthenticated, getExercise);
    router.post("/exercises", isAuthenticated, isAdmin, makeExercise);
    router.put("/exercises/:id", isAuthenticated, isAdmin, updateExercise);
    router.delete("/exercises/:id", isAuthenticated, isAdmin, deleteExercise);
};
