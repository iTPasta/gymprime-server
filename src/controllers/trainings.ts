import express from "express";
import mongoose from "mongoose";
import {
    createTraining,
    deleteTrainingById,
    getTrainingById,
    getTrainings,
    updateTrainingById,
} from "../db/trainings";

export const getTraining = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        const { id } = req.params;

        if (!id) {
            return res.sendStatus(400);
        }

        const userTrainingsIds: mongoose.Types.ObjectId[] = user.trainings;

        if (!user.ownTraining(id)) {
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
};

export const makeTraining = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user, name, date, notes, sets } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        if (!date) {
            return res.sendStatus(400);
        }

        const trainingId = await createTraining({
            name: name ?? undefined,
            date: date,
            notes: notes ?? undefined,
            sets: sets ?? undefined,
        });

        const trainingsLastUpdate: number = user.addTraining(trainingId);

        if (!trainingsLastUpdate) {
            return res.sendStatus(500);
        }

        await user.save();

        return res.status(200).json({
            trainingId: trainingId,
            trainingsLastUpdate: trainingsLastUpdate,
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const deleteTraining = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user } = req.body;
        const { id } = req.params;

        if (!user) {
            return res.sendStatus(500);
        }

        if (!id) {
            return res.sendStatus(400);
        }

        if (!user.ownTraining(id)) {
            return res.sendStatus(401);
        }

        const training = await getTrainingById(id);

        if (!training) {
            return res.sendStatus(400);
        }

        await deleteTrainingById(id);

        const trainingsLastUpdate: number = user.removeTraining(id);

        if (!trainingsLastUpdate) {
            return res.sendStatus(500);
        }

        await user.save();

        return res
            .status(200)
            .json({ trainingsLastUpdate: trainingsLastUpdate });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const updateTraining = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const { user, name, date, notes, sets } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        if (!id || !date) {
            return res.sendStatus(400);
        }

        if (!user.ownTraining(id)) {
            return res.sendStatus(401);
        }

        const values = {
            name: name ?? undefined,
            date: date,
            notes: notes ?? undefined,
            sets: sets ?? undefined,
        };

        await updateTrainingById(id, values);

        const trainingsLastUpdate: number = user.refreshTrainingsLastUpdate();
        await user.save();

        return res
            .sendStatus(200)
            .json({ trainingsLastUpdate: trainingsLastUpdate });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getMyTrainings = async (
    req: express.Request,
    res: express.Response
) => {
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
};

export const getAllTrainings = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const trainings = await getTrainings();

        return res.status(200).json(trainings);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
