import express from "express";
import {
    createMuscleGroup,
    deleteMuscleGroupById,
    getMuscleGroupById,
    getMuscleGroups,
    updateMuscleGroupById,
} from "../db/muscle_groups";
import { GlobalModel } from "../db/globals";

export const getMuscleGroup = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res
                .status(400)
                .json({ error: "No id parameter found in the request." });
        }

        const muscleGroup = await getMuscleGroupById(id);

        if (!muscleGroup) {
            return res.status(404).json({
                error: "Database does not contain any muscle group corresponding to the provided id.",
            });
        }

        return res.status(200).json({ muscleGroup: muscleGroup });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const makeMuscleGroup = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { names, descriptions, muscles, image } = req.body;

        const muscleGroupId = await createMuscleGroup({
            names: names ?? undefined,
            descriptions: descriptions ?? undefined,
            muscles: muscles ?? undefined,
            image: image ?? undefined,
        });

        const muscleGroupsLastUpdate =
            await GlobalModel.refreshMuscleGroupsLastUpdateAndSave();

        return res.status(200).json({
            muscleGroupId: muscleGroupId,
            muscleGroupsLastUpdate: muscleGroupsLastUpdate,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const deleteMuscleGroup = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res
                .status(400)
                .json({ error: "No id parameter found in the request." });
        }

        await deleteMuscleGroupById(id);

        const muscleGroupsLastUpdate =
            await GlobalModel.refreshMuscleGroupsLastUpdateAndSave();

        return res
            .status(200)
            .json({ muscleGroupsLastUpdate: muscleGroupsLastUpdate });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const updateMuscleGroup = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const { names, descriptions, muscles, image } = req.body;

        if (!id) {
            return res
                .status(400)
                .json({ error: "No id parameter found in the request." });
        }

        const values = {
            names: names ?? undefined,
            descriptions: descriptions ?? undefined,
            muscles: muscles ?? undefined,
            image: image ?? undefined,
        };

        await updateMuscleGroupById(id, values);

        const muscleGroupsLastUpdate =
            await GlobalModel.refreshMuscleGroupsLastUpdateAndSave();

        return res
            .status(200)
            .json({ muscleGroupsLastUpdate: muscleGroupsLastUpdate });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const getAllMuscleGroups = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const muscleGroups = getMuscleGroups();

        return res.status(200).json({ muscleGroups: muscleGroups });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};
