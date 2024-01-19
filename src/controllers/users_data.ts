import express from 'express';
import { getDietById } from '../db/diets';
import { getMealById } from '../db/meals';
import { getRecipeById } from '../db/recipes';
import { getProgramById } from '../db/programs';
import { getTrainingById } from '../db/trainings';

export const getMyData = async (req: express.Request, res: express.Response) => {
    const { user } = req.body;

    if (!user) {
        return res.sendStatus(500);
    }

    const preferences = user.preferences;

    const dietsIds = user.diets.toObject();
    const dietsArray = [];
    for (const id of dietsIds) {
        dietsArray.push(await getDietById(id));
        // TODO: Si indéfini supprimer.
    }

    const mealsIds = user.meals.toObject();
    const mealsArray = [];
    for (const id of mealsIds) {
        mealsArray.push(await getMealById(id));
    }

    const recipesIds = user.recipes;
    const recipesArray = [];
    for (const id of recipesIds) {
        recipesArray.push(await getRecipeById(id));
    }

    const programsIds = user.programs;
    const programsArray = [];
    for (const id of programsIds) {
        programsArray.push(await getProgramById(id));
    }

    const trainingsIds = user.trainings;
    const trainingsArray = [];
    for (const id of trainingsIds) {
        trainingsArray.push(await getTrainingById(id));
    }

    return res.status(200).json({
        preferences: preferences,
        diets: dietsArray,
        meals: mealsArray,
        recipes: recipesArray,
        programs: programsArray,
        trainings: trainingsArray
    });
}