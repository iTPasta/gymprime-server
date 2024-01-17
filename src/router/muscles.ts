import express from 'express';

import { isAuthenticated, isAdmin } from '../middlewares';
import { deleteMuscle, getAllMuscles, getMuscle, makeMuscle, updateMuscle } from '../controllers/muscles';

export default (router: express.Router) => {
    router.get('/muscles/all', isAuthenticated, getAllMuscles);
    router.get('/muscles/:id', isAuthenticated, getMuscle);
    router.post('/muscles', isAuthenticated, isAdmin, makeMuscle);
    router.put('/muscles/:id', isAuthenticated, isAdmin, updateMuscle);
    router.delete('/muscles/:id', isAuthenticated, isAdmin, deleteMuscle);
}