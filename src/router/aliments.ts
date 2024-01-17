import express from 'express';

import { isAuthenticated, isAdmin } from '../middlewares';
import { makeAliment, getAliment, getAllAliments, deleteAliment, updateAliment } from '../controllers/aliments';

export default (router: express.Router) => {
    router.get('/aliments/all', isAuthenticated, isAdmin, getAllAliments);
    router.get('/aliments/:id', isAuthenticated, getAliment);
    router.post('/aliments', isAuthenticated, isAdmin, makeAliment);
    router.put('/aliments/:id', isAuthenticated, isAdmin, updateAliment);
    router.delete('/aliments/:id', isAuthenticated, isAdmin, deleteAliment);
}