import express from "express";

import { createExercise, deleteExerciseById, getExerciseById, getExercises, updateExerciseById } from "../db/exercises";

export const getExercise = async (req: express.Request, res: express.Response) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.sendStatus(400);
        }

        const exercise = await getExerciseById(id);

        if (!exercise) {
            return res.sendStatus(404);
        }

        return res.status(200).json(exercise);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const makeExercise = async (req: express.Request, res: express.Response) => {
    try {
        const {
            name,
            description,
            muscles,
            muscle_group,
            image
        } = req.body;

        if (!name) {
            return res.sendStatus(400)
        }

        const exercise = await createExercise({
            name: name,
            description: description ?? undefined,
            muscles: muscles ?? undefined,
            muscle_group: muscle_group ?? undefined,
            image: image ?? undefined
        });

        return res.status(200).json(exercise);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteExercise = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.sendStatus(400);
        }

        await deleteExerciseById(id);

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateExercise = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            muscles,
            muscle_group,
            image
        } = req.body;

        if (!id) {
            return res.sendStatus(400);
        }

        const values = {
            name: name ?? undefined,
            description: description ?? undefined,
            muscles: muscles ?? undefined,
            muscle_group: muscle_group ?? undefined,
            image: image ?? undefined
        };

        const updatedExercise = await updateExerciseById(id, values);

        return res.status(200).json(updatedExercise);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getAllExercises = async (req: express.Request, res: express.Response) => {
    try {
        const exercises = await getExercises();

        return res.status(200).json(exercises);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}