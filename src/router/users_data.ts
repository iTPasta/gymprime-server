import express from 'express';

import { isAuthenticated } from '../middlewares';
import { getMyData } from '../controllers/users_data';

export default (router: express.Router) => {
    router.get('/mydata', isAuthenticated, getMyData);
}