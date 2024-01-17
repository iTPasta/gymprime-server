import express from "express";
import { createMuscle, deleteMuscleById, getMuscleById, getMuscles, updateMuscleById } from "../db/muscles";

export const getMuscle = async (req: express.Request, res: express.Response) => {
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
}

export const makeMuscle = async (req: express.Request, res: express.Response) => {
    try {
        const {
            name,
            description,
            exercises,
            muscle_group,
            image
        } = req.body;

        if (!name) {
            return res.sendStatus(400)
        }

        const muscle = await createMuscle({
            name: name,
            description: description ?? undefined,
            exercises: exercises ?? undefined,
            muscle_group: muscle_group ?? undefined,
            image: image ?? undefined
        });

        return res.status(200).json(muscle);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteMuscle = async (req: express.Request, res: express.Response) => {
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
}

export const updateMuscle = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            exercises,
            muscle_group,
            image
        } = req.body;

        if (!id) {
            return res.sendStatus(400);
        }

        const values = {
            name: name ?? undefined,
            description: description ?? undefined,
            exercises: exercises ?? undefined,
            muscle_group: muscle_group ?? undefined,
            image: image ?? undefined
        };

        const updatedMuscle = await updateMuscleById(id, values);

        return res.status(200).json(updatedMuscle);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getAllMuscles = async (req: express.Request, res: express.Response) => {
    try {
        const muscles = getMuscles();

        return res.status(200).json(muscles);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}