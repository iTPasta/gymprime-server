import express from "express";

import { getAllUsers } from "../controllers/users";
import { isAuthenticated, isAdmin } from "../middlewares";

export default (router: express.Router) => {
    router.get("/users", isAuthenticated, isAdmin, getAllUsers);
};
