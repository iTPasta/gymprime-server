import express from 'express';

import { isAuthenticated } from '../middlewares';
import { getMyPreferences } from '../controllers/preferences';

export default (router: express.Router) => {
    router.get('/preferences', isAuthenticated, getMyPreferences);
}