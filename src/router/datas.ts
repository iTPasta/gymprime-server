import express from "express";

import { isAuthenticated } from "../middlewares";
import {
    getAllData,
    getLastUpdates,
    getMyData,
    getPublicData,
    getSomeData,
} from "../controllers/datas";

export default (router: express.Router) => {
    router.get("/all", isAuthenticated, getAllData);
    router.get("/some", isAuthenticated, getSomeData);
    router.get("/public", isAuthenticated, getPublicData);
    router.get("/mine", isAuthenticated, getMyData);
    router.get("/lastupdates", isAuthenticated, getLastUpdates);
};
