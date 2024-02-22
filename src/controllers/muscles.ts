import express from "express";
import {
    IMuscle,
    createMuscle,
    deleteMuscleById,
    getMuscleById,
    getMuscles,
    updateMuscleById,
} from "../db/muscles";
import { GlobalModel } from "../db/globals";

export const getMuscle = async (
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

        const muscle = await getMuscleById(id);

        if (!muscle) {
            return res.status(404).json({
                error: "Database does not contain any muscle corresponding to the provided id.",
            });
        }

        return res.status(200).json({ muscle: muscle });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const makeMuscle = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { names, descriptions, exercises, muscleGroup, image } =
            req.body as {
                names: IMuscle["names"];
                descriptions: IMuscle["descriptions"];
                exercises: IMuscle["exercises"];
                muscleGroup: IMuscle["muscleGroup"];
                image: IMuscle["image"];
            };

        const muscleId = await createMuscle({
            names: names ?? undefined,
            descriptions: descriptions ?? undefined,
            exercises: exercises ?? undefined,
            muscleGroup: muscleGroup ?? undefined,
            image: image ?? undefined,
        });

        const musclesLastUpdate =
            await GlobalModel.refreshMusclesLastUpdateAndSave();

        return res
            .status(200)
            .json({ muscleId: muscleId, musclesLastUpdate: musclesLastUpdate });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const deleteMuscle = async (
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

        await deleteMuscleById(id);

        const musclesLastUpdate =
            await GlobalModel.refreshMusclesLastUpdateAndSave();

        return res.status(200).json({ musclesLastUpdate: musclesLastUpdate });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const updateMuscle = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params as { id: string };
        const { names, descriptions, exercises, muscleGroup, image } =
            req.body as {
                names: IMuscle["names"];
                descriptions: IMuscle["descriptions"];
                exercises: IMuscle["exercises"];
                muscleGroup: IMuscle["muscleGroup"];
                image: IMuscle["image"];
            };

        if (!id) {
            return res
                .status(400)
                .json({ error: "No id parameter found in the request." });
        }

        const values = {
            names: names ?? undefined,
            descriptions: descriptions ?? undefined,
            exercises: exercises ?? undefined,
            muscleGroup: muscleGroup ?? undefined,
            image: image ?? undefined,
        };

        await updateMuscleById(id, values);

        const musclesLastUpdate =
            await GlobalModel.refreshMusclesLastUpdateAndSave();

        return res.status(200).json({ musclesLastUpdate: musclesLastUpdate });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const getAllMuscles = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const muscles = getMuscles();

        const musclesLastUpdate = (await GlobalModel.getPublicLastUpdates())[
            "muscles"
        ];

        return res
            .status(200)
            .json({ muscles: muscles, musclesLastUpdate: musclesLastUpdate });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};
