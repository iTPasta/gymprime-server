import express from "express";

import { isAuthenticated } from "../middlewares";
import {
    getAllData,
    getMyData,
    getPublicData,
    getSomeData,
} from "../controllers/data";

export default (router: express.Router) => {
    router.get("data/all", isAuthenticated, getAllData);
    router.get("data/some", isAuthenticated, getSomeData);
    router.get("data/public", isAuthenticated, getPublicData);
    router.get("data/private", isAuthenticated, getMyData);
};
