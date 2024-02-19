import express from "express";
import mongoose from "mongoose";
import {
    createProgram,
    deleteProgramById,
    getProgramById,
    getPrograms,
    updateProgramById,
} from "../db/programs";

export const getProgram = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const user = req.body.user;

        const id = req.params.id;

        if (!id) {
            return res
                .status(400)
                .json({ error: "No id parameter found in the request." });
        }

        if (!user.ownProgram(id)) {
            return res
                .status(401)
                .json({ error: "User does not own the requested program." });
        }

        const program = await getProgramById(id);

        if (!program) {
            return res.status(400).json({
                error: "Database does not contain any program corresponding to the provided id.",
            });
        }

        return res.status(200).json({ program: program });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const makeProgram = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user, name, description, exercises, trainings, goal } =
            req.body;

        const programId = await createProgram({
            name: name ?? undefined,
            description: description ?? undefined,
            exercises: exercises ?? undefined,
            trainings: trainings ?? undefined,
            goal: goal ?? undefined,
        });

        const programsLastUpdate: number = user.addProgram(programId);
        await user.save();

        return res.status(200).json({
            programId: programId,
            programsLastUpdate: programsLastUpdate,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const deleteProgram = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user } = req.body;
        const { id } = req.params;

        if (!id) {
            return res
                .status(400)
                .json({ error: "No id parameter found in the request." });
        }

        if (!user.ownProgram(id)) {
            return res.status(401).json({
                error: "User does not own the program corresponding to the provided id.",
            });
        }

        const program = await getProgramById(id);

        if (!program) {
            return res.status(400).json({
                error: "Database does not contain any program corresponding to the provided id.",
            });
        }

        await deleteProgramById(id);

        const programsLastUpdate: number = user.deleteDiet(id);
        await user.save();

        return res.status(200).json({ programsLastUpdate: programsLastUpdate });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const updateProgram = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const { user, name, description, exercises, trainings, goal } =
            req.body;

        if (!id) {
            return res
                .status(400)
                .json({ error: "No id parameter found in the request." });
        }

        if (!user.ownProgram(id)) {
            return res.status(401).json({
                error: "User does not own the program corresponding to the provided id.",
            });
        }

        const values = {
            name: name ?? undefined,
            description: description ?? undefined,
            exercises: exercises ?? undefined,
            trainings: trainings ?? undefined,
            goal: goal ?? undefined,
        };

        await updateProgramById(id, values);

        const programsLastUpdate: number = user.refreshProgramsLastUpdate();
        await user.save();

        return res.status(200).json({ programsLastUpdate: programsLastUpdate });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const getMyPrograms = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user } = req.body;

        const programsIds = user.programs;
        const programs = [];
        for (const id of programsIds) {
            programs.push(await getProgramById(id));
        }

        res.status(200).json({ programs: programs });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const getAllPrograms = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const programs = await getPrograms();

        return res.status(200).json({ programs: programs });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};
