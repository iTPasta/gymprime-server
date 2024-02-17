import express from "express";
import { getDietById } from "../db/diets";
import { getMealById } from "../db/meals";
import { getRecipeById } from "../db/recipes";
import { getProgramById } from "../db/programs";
import { getTrainingById } from "../db/trainings";
import { getExercises } from "../db/exercises";
import { getMuscles } from "../db/muscles";
import { getMuscleGroups } from "../db/muscle_groups";
import { getGlobalByName } from "../db/globals";

export const getAllData = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        const userLastUpdates = user.lastUpdates;
        const publicLastUpdates = await getGlobalByName("publicLastUpdates");

        const lastUpdates = {
            preferencesLastUpdate: userLastUpdates.preferences,
            dietsLastUpdate: userLastUpdates.diets,
            mealsLastUpdate: userLastUpdates.meals,
            recipesLastUpdate: userLastUpdates.recipes,
            programsLastUpdate: userLastUpdates.programs,
            trainingsLastUpdate: userLastUpdates.trainings,
            exercisesLastUpdate: publicLastUpdates?.value.exercises,
            muscleGroupsLastUpdate: publicLastUpdates?.value.muscleGroups,
            musclesLastUpdate: publicLastUpdates?.value.muscles,
        };

        const preferences = user.preferences;

        const dietsIds = user.diets.toObject();
        const dietsArray = [];
        for (const id of dietsIds) {
            dietsArray.push(await getDietById(id));
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

        const exercisesArray = await getExercises();

        const musclesArray = await getMuscles();

        const muscleGroupsArray = await getMuscleGroups();

        return res.status(200).json({
            lastUpdates: lastUpdates,
            preferences: preferences,
            diets: dietsArray,
            meals: mealsArray,
            recipes: recipesArray,
            programs: programsArray,
            trainings: trainingsArray,
            exercises: exercisesArray,
            muscles: musclesArray,
            muscleGroups: muscleGroupsArray,
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getSomeData = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const {
            user,
            wantPreferences,
            wantDiets,
            wantMeals,
            wantRecipes,
            wantPrograms,
            wantTrainings,
            wantExercises,
            wantMuscles,
            wantMuscleGroups,
        } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        const preferences = wantPreferences ? user.preferences : undefined;

        const diets = [];
        if (wantDiets) {
            const dietsIds = user.diets.toObject();
            for (const id of dietsIds) {
                diets.push(await getDietById(id));
            }
        }

        const meals = [];
        if (wantMeals) {
            const mealsIds = user.meals.toObject();
            for (const id of mealsIds) {
                meals.push(await getMealById(id));
            }
        }

        const recipes = [];
        if (wantRecipes) {
            const recipesIds = user.recipes;
            for (const id of recipesIds) {
                recipes.push(await getRecipeById(id));
            }
        }

        const programs = [];
        if (wantPrograms) {
            const programsIds = user.programs;
            for (const id of programsIds) {
                programs.push(await getProgramById(id));
            }
        }

        const trainings = [];
        if (wantTrainings) {
            const trainingsIds = user.trainings;
            for (const id of trainingsIds) {
                trainings.push(await getTrainingById(id));
            }
        }

        const exercises = wantExercises ? await getExercises() : undefined;

        const muscles = wantMuscles ? await getMuscles() : undefined;

        const muscleGroups = wantMuscleGroups
            ? await getMuscleGroups()
            : undefined;

        return res.status(200).json({
            preferences: preferences,
            diets: wantDiets ? diets : undefined,
            meals: wantMeals ? meals : undefined,
            recipes: wantRecipes ? recipes : undefined,
            programs: wantPrograms ? programs : undefined,
            trainings: wantTrainings ? trainings : undefined,
            exercises: exercises,
            muscles: muscles,
            muscleGroups: muscleGroups,
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getPublicData = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        const lastUpdates = user.lastUpdates;

        const exercisesArray = await getExercises();

        const musclesArray = await getMuscles();

        const muscleGroupsArray = await getMuscleGroups();

        return res.status(200).json({
            lastUpdates: lastUpdates,
            exercises: exercisesArray,
            muscles: musclesArray,
            muscleGroups: muscleGroupsArray,
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getMyData = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        const lastUpdates = user.lastUpdates;

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
            lastUpdates: lastUpdates,
            preferences: preferences,
            diets: dietsArray,
            meals: mealsArray,
            recipes: recipesArray,
            programs: programsArray,
            trainings: trainingsArray,
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getLastUpdates = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        const userLastUpdates = user.lastUpdates;
        const publicLastUpdates = await getGlobalByName("publicLastUpdates");

        return res.status(200).json({
            preferencesLastUpdate: userLastUpdates.preferences,
            dietsLastUpdate: userLastUpdates.diets,
            mealsLastUpdate: userLastUpdates.meals,
            recipesLastUpdate: userLastUpdates.recipes,
            programsLastUpdate: userLastUpdates.programs,
            trainingsLastUpdate: userLastUpdates.trainings,
            exercisesLastUpdate: publicLastUpdates?.value.exercises,
            muscleGroupsLastUpdate: publicLastUpdates?.value.muscleGroups,
            musclesLastUpdate: publicLastUpdates?.value.muscles,
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
