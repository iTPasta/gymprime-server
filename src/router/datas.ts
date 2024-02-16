import express from "express";

import { isAuthenticated } from "../middlewares";
import {
    getAllData,
    getMyData,
    getPublicData,
    getLastUpdateDates,
} from "../controllers/datas";

export default (router: express.Router) => {
    router.get("/all", isAuthenticated, getAllData);
    router.get("/public", isAuthenticated, getPublicData);
    router.get("/mine", isAuthenticated, getMyData);
    router.get("/lastupdates", isAuthenticated, getLastUpdateDates);
};
