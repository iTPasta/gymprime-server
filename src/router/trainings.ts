import express from "express";

import { isAuthenticated, isAdmin } from "../middlewares";
import {
    deleteTraining,
    getAllTrainings,
    getMyTrainings,
    getTraining,
    makeTraining,
    updateTraining,
} from "../controllers/trainings";

export default (router: express.Router) => {
    router.get("/trainings/all", isAuthenticated, isAdmin, getAllTrainings);
    router.get("/trainings/:id", isAuthenticated, getTraining);
    router.get("/trainings", isAuthenticated, getMyTrainings);
    router.post("/trainings", isAuthenticated, makeTraining);
    router.put("/trainings/:id", isAuthenticated, updateTraining);
    router.delete("/trainings/:id", isAuthenticated, deleteTraining);
};
