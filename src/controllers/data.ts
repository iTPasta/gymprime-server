import express from "express";
import { getDietById } from "../db/diets";
import { getMealById } from "../db/meals";
import { getRecipeById } from "../db/recipes";
import { getProgramById } from "../db/programs";
import { getTrainingById } from "../db/trainings";
import { getExercises } from "../db/exercises";
import { getMuscles } from "../db/muscles";
import { getMuscleGroups } from "../db/muscle_groups";
import { GlobalModel, getGlobalByName } from "../db/globals";
import { IUser } from "../db/users";

export const getAllData = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user } = req.body as { user: IUser };

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

        const dietsIds = user.diets;
        const diets = [];
        for (const id of dietsIds) {
            diets.push(await getDietById(id));
        }

        const mealsIds = user.meals;
        const meals = [];
        for (const id of mealsIds) {
            meals.push(await getMealById(id));
        }

        const recipesIds = user.recipes;
        const recipes = [];
        for (const id of recipesIds) {
            recipes.push(await getRecipeById(id));
        }

        const programsIds = user.programs;
        const programs = [];
        for (const id of programsIds) {
            programs.push(await getProgramById(id));
        }

        const trainingsIds = user.trainings;
        const trainings = [];
        for (const id of trainingsIds) {
            trainings.push(await getTrainingById(id));
        }

        const exercises = await getExercises();

        const muscles = await getMuscles();

        const muscleGroups = await getMuscleGroups();

        return res.status(200).json({
            lastUpdates: lastUpdates,
            preferences: preferences,
            diets: diets,
            meals: meals,
            recipes: recipes,
            programs: programs,
            trainings: trainings,
            exercises: exercises,
            muscles: muscles,
            muscleGroups: muscleGroups,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
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
        } = req.body as {
            user: IUser;
            wantPreferences: boolean;
            wantDiets: boolean;
            wantMeals: boolean;
            wantRecipes: boolean;
            wantPrograms: boolean;
            wantTrainings: boolean;
            wantExercises: boolean;
            wantMuscles: boolean;
            wantMuscleGroups: boolean;
        };

        const preferences = wantPreferences ? user.preferences : undefined;

        const diets = [];
        if (wantDiets) {
            const dietsIds = user.diets;
            for (const id of dietsIds) {
                diets.push(await getDietById(id));
            }
        }

        const meals = [];
        if (wantMeals) {
            const mealsIds = user.meals;
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
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const getPublicData = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const publicLastUpdates = await GlobalModel.getPublicLastUpdates();

        const exercises = await getExercises();

        const muscles = await getMuscles();

        const muscleGroups = await getMuscleGroups();

        return res.status(200).json({
            publicLastUpdates: publicLastUpdates,
            exercises: exercises,
            muscles: muscles,
            muscleGroups: muscleGroups,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const getMyData = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user } = req.body as { user: IUser };

        const lastUpdates = user.lastUpdates;

        const preferences = user.preferences;

        const dietsIds = user.diets;
        const diets = [];
        for (const id of dietsIds) {
            diets.push(await getDietById(id));
        }

        const mealsIds = user.meals;
        const meals = [];
        for (const id of mealsIds) {
            meals.push(await getMealById(id));
        }

        const recipesIds = user.recipes;
        const recipes = [];
        for (const id of recipesIds) {
            recipes.push(await getRecipeById(id));
        }

        const programsIds = user.programs;
        const programs = [];
        for (const id of programsIds) {
            programs.push(await getProgramById(id));
        }

        const trainingsIds = user.trainings;
        const trainings = [];
        for (const id of trainingsIds) {
            trainings.push(await getTrainingById(id));
        }

        return res.status(200).json({
            lastUpdates: lastUpdates,
            preferences: preferences,
            diets: diets,
            meals: meals,
            recipes: recipes,
            programs: programs,
            trainings: trainings,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const getLastUpdates = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user } = req.body as { user: IUser };

        const userLastUpdates = user.lastUpdates;
        const publicLastUpdates = await GlobalModel.getPublicLastUpdates();

        return res.status(200).json({
            preferencesLastUpdate: userLastUpdates.preferences,
            dietsLastUpdate: userLastUpdates.diets,
            mealsLastUpdate: userLastUpdates.meals,
            recipesLastUpdate: userLastUpdates.recipes,
            programsLastUpdate: userLastUpdates.programs,
            trainingsLastUpdate: userLastUpdates.trainings,
            exercisesLastUpdate: publicLastUpdates.exercises,
            muscleGroupsLastUpdate: publicLastUpdates.muscleGroups,
            musclesLastUpdate: publicLastUpdates.muscles,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const getPrivateLastUpdates = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user } = req.body as { user: IUser };

        const userLastUpdates = user.lastUpdates;

        return res.status(200).json({
            preferencesLastUpdate: userLastUpdates.preferences,
            dietsLastUpdate: userLastUpdates.diets,
            mealsLastUpdate: userLastUpdates.meals,
            recipesLastUpdate: userLastUpdates.recipes,
            programsLastUpdate: userLastUpdates.programs,
            trainingsLastUpdate: userLastUpdates.trainings,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const getPublicLastUpdates = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const publicLastUpdates = await GlobalModel.getPublicLastUpdates();

        return res.status(200).json({
            exercisesLastUpdate: publicLastUpdates.exercises,
            muscleGroupsLastUpdate: publicLastUpdates.muscleGroups,
            musclesLastUpdate: publicLastUpdates.muscles,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};