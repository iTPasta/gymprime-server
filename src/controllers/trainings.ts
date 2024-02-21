import express from "express";
import mongoose from "mongoose";
import {
    ITraining,
    createTraining,
    deleteTrainingById,
    getTrainingById,
    getTrainings,
    updateTrainingById,
} from "../db/trainings";
import { IUser } from "../db/users";

export const getTraining = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user } = req.body as { user: IUser };

        const { id } = req.params as { id: string };

        if (!id) {
            return res
                .status(400)
                .json({ error: "No id parameter found in the request." });
        }

        if (!user.ownTraining(id)) {
            return res.status(401).json({
                error: "User does not own the requested training.",
            });
        }

        const training = await getTrainingById(id);

        if (!training) {
            return res.status(400).json({
                error: "Database does not contain any training corresponding to the provided id.",
            });
        }

        return res.status(200).json({ training: training });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const makeTraining = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user, name, date, notes, sets } = req.body as {
            user: IUser;
            name: ITraining["name"];
            date: ITraining["date"];
            notes: ITraining["notes"];
            sets: ITraining["sets"];
        };

        if (!date) {
            return res
                .status(400)
                .json({ error: "Missing date in request body." });
        }

        const trainingId = await createTraining({
            name: name ?? undefined,
            date: date,
            notes: notes ?? undefined,
            sets: sets ?? undefined,
        });

        const trainingsLastUpdate: number = user.addTraining(trainingId);
        await user.save();

        return res.status(200).json({
            trainingId: trainingId,
            trainingsLastUpdate: trainingsLastUpdate,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const deleteTraining = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user } = req.body as { user: IUser };
        const { id } = req.params as { id: string };

        if (!id) {
            return res
                .status(400)
                .json({ error: "No id parameter found in the request." });
        }

        if (!user.ownTraining(id)) {
            return res.status(401).json({
                error: "User does not own the training corresponding to the provided id.",
            });
        }

        const training = await getTrainingById(id);

        if (!training) {
            return res.status(400).json({
                error: "Database does not contain any training corresponding to the provided id.",
            });
        }

        await deleteTrainingById(id);

        const trainingsLastUpdate: number = user.removeTraining(id);
        await user.save();

        return res
            .status(200)
            .json({ trainingsLastUpdate: trainingsLastUpdate });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const updateTraining = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params as { id: string };
        const { user, name, date, notes, sets } = req.body as {
            user: IUser;
            name: ITraining["name"];
            date: ITraining["date"];
            notes: ITraining["notes"];
            sets: ITraining["sets"];
        };

        if (!id || !date) {
            return res.status(400).json({
                error: "Missing id in request parameters, or date in request body.",
            });
        }

        if (!user.ownTraining(id)) {
            return res.status(401).json({
                error: "User does not own the training corresponding to the provided id.",
            });
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
            .status(200)
            .json({ trainingsLastUpdate: trainingsLastUpdate });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const getMyTrainings = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user } = req.body as { user: IUser };

        const trainingsIds = user.trainings;
        const trainings = [];
        for (const id of trainingsIds) {
            trainings.push(await getTrainingById(id));
        }

        res.status(200).json({ trainings: trainings });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const getAllTrainings = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const trainings = await getTrainings();

        return res.status(200).json({ trainings: trainings });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};
