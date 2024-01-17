import express from 'express';

import { isAuthenticated, isAdmin } from '../middlewares';
import { getAllMuscleGroups, getMuscleGroup, makeMuscleGroup, updateMuscleGroup, deleteMuscleGroup } from '../controllers/muscle_groups';

export default (router: express.Router) => {
    router.get('/musclegroups/all', isAuthenticated, getAllMuscleGroups);
    router.get('/musclegroups/:id', isAuthenticated, getMuscleGroup);
    router.post('/musclegroups', isAuthenticated, isAdmin, makeMuscleGroup);
    router.put('/musclegroups/:id', isAuthenticated, isAdmin, updateMuscleGroup);
    router.delete('/musclegroups/:id', isAuthenticated, isAdmin, deleteMuscleGroup);
}