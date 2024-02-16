import express from "express";
import {
    createMuscleGroup,
    deleteMuscleGroupById,
    getMuscleGroupById,
    getMuscleGroups,
    updateMuscleGroupById,
} from "../db/muscle_groups";

export const getMuscleGroup = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.sendStatus(400);
        }

        const muscleGroup = await getMuscleGroupById(id);

        if (!muscleGroup) {
            return res.sendStatus(404);
        }

        return res.status(200).json(muscleGroup);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
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

        return res.status(200).json(muscleGroupId);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const deleteMuscleGroup = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.sendStatus(400);
        }

        await deleteMuscleGroupById(id);

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
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
            return res.sendStatus(400);
        }

        const values = {
            names: names ?? undefined,
            descriptions: descriptions ?? undefined,
            muscles: muscles ?? undefined,
            image: image ?? undefined,
        };

        await updateMuscleGroupById(id, values);

        return res.status(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getAllMuscleGroups = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const muscleGroups = getMuscleGroups();

        return res.status(200).json(muscleGroups);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
