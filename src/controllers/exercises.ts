import express from "express";

import {
    IExercise,
    createExercise,
    deleteExerciseById,
    getExerciseById,
    getExercises,
    updateExerciseById,
} from "../db/exercises";
import { GlobalModel } from "../db/globals";

export const getExercise = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params as { id: string };

        if (!id) {
            return res
                .status(400)
                .json({ error: "No id parameter found in the request." });
        }

        const exercise = await getExerciseById(id);

        if (!exercise) {
            return res.status(404).json({
                error: "Database does not contain any exercise corresponding to the provided id.",
            });
        }

        return res.status(200).json({ exercise: exercise });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

interface ITest {}

export const makeExercise = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { names, descriptions, muscles, muscleGroup, image } =
            req.body as {
                names: IExercise["names"];
                descriptions: IExercise["descriptions"];
                muscles: IExercise["muscles"];
                muscleGroup: IExercise["muscleGroup"];
                image: IExercise["image"];
            };

        const exerciseId = await createExercise({
            names: names ?? undefined,
            descriptions: descriptions ?? undefined,
            muscles: muscles ?? undefined,
            muscleGroup: muscleGroup ?? undefined,
            image: image ?? undefined,
        });

        const exercisesLastUpdate =
            await GlobalModel.refreshExercisesLastUpdateAndSave();

        return res.status(201).json({
            exerciseId: exerciseId,
            exercisesLastUpdate: exercisesLastUpdate,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const deleteExercise = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params as { id: string };

        if (!id) {
            return res
                .status(400)
                .json({ error: "No id parameter found in the request." });
        }

        await deleteExerciseById(id);

        const exercisesLastUpdate =
            await GlobalModel.refreshExercisesLastUpdateAndSave();

        return res
            .status(200)
            .json({ exercisesLastUpdate: exercisesLastUpdate });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const updateExercise = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params as { id: string };
        const { names, descriptions, muscles, muscleGroup, image } =
            req.body as {
                names: IExercise["names"];
                descriptions: IExercise["descriptions"];
                muscles: IExercise["muscles"];
                muscleGroup: IExercise["muscleGroup"];
                image: IExercise["image"];
            };

        if (!id) {
            return res
                .status(400)
                .json({ error: "No id parameter found in the request." });
        }

        const values = {
            names: names ?? undefined,
            descriptions: descriptions ?? undefined,
            muscles: muscles ?? undefined,
            muscleGroup: muscleGroup ?? undefined,
            image: image ?? undefined,
        };

        await updateExerciseById(id, values);

        const exercisesLastUpdate =
            await GlobalModel.refreshExercisesLastUpdateAndSave();

        return res
            .status(200)
            .json({ exercisesLastUpdate: exercisesLastUpdate });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const getAllExercises = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const exercises = await getExercises();

        const exercisesLastUpdate = (await GlobalModel.getPublicLastUpdates())[
            "exercises"
        ];

        return res
            .status(200)
            .json({
                exercises: exercises,
                exercisesLastUpdate: exercisesLastUpdate,
            });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};
