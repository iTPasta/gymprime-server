import express from "express";

import { isAuthenticated } from "../middlewares";
import {
    getAllData,
    getLastUpdates,
    getMyData,
    getPrivateLastUpdates,
    getPublicData,
    getPublicLastUpdates,
    getSomeData,
} from "../controllers/data";

export default (router: express.Router) => {
    router.get("data/all", isAuthenticated, getAllData);
    router.get("data/some", isAuthenticated, getSomeData);
    router.get("data/public", isAuthenticated, getPublicData);
    router.get("data/private", isAuthenticated, getMyData);
    router.get("data/lastupdates", isAuthenticated, getLastUpdates);
    router.get(
        "data/lastupdates/public",
        isAuthenticated,
        getPrivateLastUpdates
    );
    router.get(
        "data/lastupdates/private",
        isAuthenticated,
        getPublicLastUpdates
    );
};
