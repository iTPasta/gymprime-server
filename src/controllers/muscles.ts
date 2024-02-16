import express from "express";
import {
    createMuscle,
    deleteMuscleById,
    getMuscleById,
    getMuscles,
    updateMuscleById,
} from "../db/muscles";

export const getMuscle = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.sendStatus(400);
        }

        const muscle = await getMuscleById(id);

        if (!muscle) {
            return res.sendStatus(404);
        }

        return res.status(200).json(muscle);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const makeMuscle = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { names, descriptions, exercises, muscleGroup, image } = req.body;

        const muscleId = await createMuscle({
            names: names ?? undefined,
            descriptions: descriptions ?? undefined,
            exercises: exercises ?? undefined,
            muscleGroup: muscleGroup ?? undefined,
            image: image ?? undefined,
        });

        return res.status(200).json(muscleId);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const deleteMuscle = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.sendStatus(400);
        }

        await deleteMuscleById(id);

        return res.status(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const updateMuscle = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const { names, descriptions, exercises, muscleGroup, image } = req.body;

        if (!id) {
            return res.sendStatus(400);
        }

        const values = {
            names: names ?? undefined,
            descriptions: descriptions ?? undefined,
            exercises: exercises ?? undefined,
            muscleGroup: muscleGroup ?? undefined,
            image: image ?? undefined,
        };

        await updateMuscleById(id, values);

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getAllMuscles = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const muscles = getMuscles();

        return res.status(200).json(muscles);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
