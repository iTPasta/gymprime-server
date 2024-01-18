import express from "express";
import mongoose from "mongoose";
import { createProgram, deleteProgramById, getProgramById, getPrograms, updateProgramById } from "../db/programs";
import { addUserProgram, removeUserProgram } from "../db/users";

export const getProgram = async (req: express.Request, res: express.Response) => {
    try {
        const user = req.body.user;

        if (!user) {
            return res.sendStatus(500);
        }

        const id = req.params.id;

        if (!id) {
            return res.sendStatus(400);
        }

        const userProgramsIds: mongoose.Types.ObjectId[] = user.programs;

        if (!userProgramsIds.some((userProgramId) => userProgramId.toString() === id)) {
            return res.sendStatus(401);
        }

        const program = await getProgramById(id);

        if (!program) {
            return res.sendStatus(400);
        }

        return res.status(200).json(program);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const makeProgram = async (req: express.Request, res: express.Response) => {
    try {
        const {
            user,
            name,
            description,
            exercises,
            trainings,
            goal
        } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        const program = await createProgram({
            name: name ?? undefined,
            description: description ?? undefined,
            exercises: exercises ?? undefined,
            trainings: trainings ?? undefined,
            goal: goal ?? undefined
        });

        await addUserProgram(user._id, program._id);

        return res.status(200).json(program);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteProgram = async (req: express.Request, res: express.Response) => {
    try {
        const { user } = req.body;
        const { id } = req.params;

        if (!user) {
            return res.sendStatus(500);
        }

        if (!id) {
            return res.sendStatus(400);
        }

        const userProgramsIds: mongoose.Types.ObjectId[] = user.programs;

        if (!userProgramsIds.some((userProgramId) => userProgramId.toString() === id)) {
            return res.sendStatus(401);
        }

        const program = await getProgramById(id);

        if (!program) {
            return res.sendStatus(400);
        }

        await removeUserProgram(user._id, id);
        await deleteProgramById(id);

        return res.status(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateProgram = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const {
            user,
            name,
            description,
            exercises,
            trainings,
            goal
        } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        if (!id) {
            return res.sendStatus(400);
        }

        const userProgramsIds: mongoose.Types.ObjectId[] = user.programs;

        if (!userProgramsIds.some((userProgramId) => userProgramId.toString() === id)) {
            return res.sendStatus(401);
        }

        const values = {
            name: name ?? undefined,
            description: description ?? undefined,
            exercises: exercises ?? undefined,
            trainings: trainings ?? undefined,
            goal: goal ?? undefined
        };

        const updatedProgram = await updateProgramById(id, values);

        return res.status(200).json(updatedProgram);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getMyPrograms = async (req: express.Request, res: express.Response) => {
    try {
        const { user } = req.body;

        if (!user) {
            return res.status(500).json({ error: "User is null or undefined in the request body." });
        }

        const programsIds = user.programs;
        const programsArray = [];
        for (const id of programsIds) {
            programsArray.push(await getProgramById(id));
        }

        res.status(200).json(programsArray);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getAllPrograms = async (req: express.Request, res: express.Response) => {
    try {
        const programs = await getPrograms();

        return res.status(200).json(programs);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}