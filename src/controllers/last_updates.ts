import express from "express";
import { IUser } from "../db/users";
import { GlobalModel } from "../db/globals";

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
