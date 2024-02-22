import express from "express";

import { isAuthenticated } from "../middlewares";
import {
    getLastUpdates,
    getPrivateLastUpdates,
    getPublicLastUpdates,
} from "../controllers/last_updates";

export default (router: express.Router) => {
    router.get("lastupdates/all", isAuthenticated, getLastUpdates);
    router.get("lastupdates/public", isAuthenticated, getPrivateLastUpdates);
    router.get("lastupdates/private", isAuthenticated, getPublicLastUpdates);
};
