import express from 'express';

import { isAuthenticated, isAdmin } from '../middlewares';
import { deleteProgram, getAllPrograms, getMyPrograms, getProgram, makeProgram, updateProgram } from '../controllers/programs';

export default (router: express.Router) => {
    router.get('/programs/all', isAuthenticated, isAdmin, getAllPrograms);
    router.get('/programs/:id', isAuthenticated, getProgram);
    router.get('/programs', isAuthenticated, getMyPrograms);
    router.post('/programs', isAuthenticated, makeProgram);
    router.put('/programs/:id', isAuthenticated, updateProgram);
    router.delete('/programs/:id', isAuthenticated, deleteProgram);
}