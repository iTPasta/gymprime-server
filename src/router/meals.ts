import express from 'express';

import { isAuthenticated, isAdmin } from '../middlewares';
import { addAlimentToMeal, addRecipeToMeal, deleteMeal, getAllMeals, getMeal, getMyMeals, makeMeal, removeAlimentFromMeal, removeRecipeFromMeal, updateMeal } from '../controllers/meals';

export default (router: express.Router) => {
    router.get('/meals/all', isAuthenticated, isAdmin, getAllMeals);
    router.get('/meals/:id', isAuthenticated, getMeal);
    router.get('/meals', isAuthenticated, getMyMeals);
    router.post('/meals', isAuthenticated, makeMeal);
    router.put('/meals/:id', isAuthenticated, updateMeal);
    router.put('/meals/aliments/:id/add', isAuthenticated, addAlimentToMeal);
    router.put('/meals/aliments/:id/remove', isAuthenticated, removeAlimentFromMeal);
    router.put('/meals/recipes/:id/add', isAuthenticated, addRecipeToMeal);
    router.put('/meals/recipes/:id/remove', isAuthenticated, removeRecipeFromMeal);
    router.delete('/meals/:id', isAuthenticated, deleteMeal);
}