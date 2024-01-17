import express from "express";
import { createTraining, deleteTrainingById, getTrainingById, getTrainings, updateTrainingById } from "../db/trainings";
import { addUserTraining, removeUserTraining } from "../db/users";

export const getTraining = async (req: express.Request, res: express.Response) => {
    try {
        const { user } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        const { id } = req.params;

        if (!id) {
            return res.sendStatus(400);
        }

        const userTrainingsIds = user.trainings;

        if (!userTrainingsIds.includes(id)) {
            return res.sendStatus(401);
        }

        const training = await getTrainingById(id);

        if (!training) {
            return res.sendStatus(400);
        }

        return res.status(200).json(training);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const makeTraining = async (req: express.Request, res: express.Response) => {
    try {
        const {
            user,
            name,
            notes,
            sets
        } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        const training = await createTraining({
            name: name ?? undefined,
            notes: notes ?? undefined,
            sets: sets ?? undefined
        });

        await addUserTraining(user._id, training._id);

        return res.status(200).json(training);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteTraining = async (req: express.Request, res: express.Response) => {
    try {
        const { user } = req.body;
        const { id } = req.params;

        if (!user) {
            return res.sendStatus(500);
        }

        if (!id) {
            return res.sendStatus(400);
        }

        const userTrainingsIds = user.trainings;

        if (!userTrainingsIds.includes(id)) {
            return res.sendStatus(401);
        }

        const training = await getTrainingById(id);

        if (!training) {
            return res.sendStatus(400);
        }

        await removeUserTraining(user._id, id);
        await deleteTrainingById(id);

        return res.status(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateTraining = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const {
            user,
            name,
            notes,
            sets
        } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        if (!id) {
            return res.sendStatus(400);
        }

        const userTrainingsIds = user.trainings;

        if (!userTrainingsIds.includes(id)) {
            return res.sendStatus(401);
        }

        const values = {
            name : name ?? undefined,
            notes: notes ?? undefined,
            sets: sets ?? undefined
        };

        const updatedTraining = await updateTrainingById(id, values);

        return res.status(200).json(updatedTraining);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getMyTrainings = async (req: express.Request, res: express.Response) => {
    try {
        const { user } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        const trainingsIds = user.trainings;
        const trainingsArray = [];
        for (const id of trainingsIds) {
            trainingsArray.push(await getTrainingById(id));
        }

        res.status(200).json(trainingsArray);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getAllTrainings = async (req: express.Request, res: express.Response) => {
    try {
        const trainings = await getTrainings();

        return res.status(200).json(trainings);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}