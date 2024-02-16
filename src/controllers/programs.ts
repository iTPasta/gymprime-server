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

        if (!user) {
            return res.sendStatus(500);
        }

        const id = req.params.id;

        if (!id) {
            return res.sendStatus(400);
        }

        const userProgramsIds: mongoose.Types.ObjectId[] = user.programs;

        if (!user.ownProgram(id)) {
            return res.sendStatus(401);
        }

        const program = await getProgramById(id);

        if (!program) {
            return res.sendStatus(400);
        }

        return res.status(200).json({ program: program });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const makeProgram = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user, name, description, exercises, trainings, goal } =
            req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        const programId = await createProgram({
            name: name ?? undefined,
            description: description ?? undefined,
            exercises: exercises ?? undefined,
            trainings: trainings ?? undefined,
            goal: goal ?? undefined,
        });

        const updateDate: number = user.addProgram(programId);

        if (!updateDate) {
            return res.sendStatus(500);
        }

        await user.save();

        return res
            .status(200)
            .json({ programId: programId, updateDate: updateDate });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const deleteProgram = async (
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

        if (!user.ownProgram(id)) {
            return res.sendStatus(401);
        }

        const program = await getProgramById(id);

        if (!program) {
            return res.sendStatus(400);
        }

        await deleteProgramById(id);

        const updateDate: number = user.deleteDiet(id);

        if (!updateDate) {
            return res.sendStatus(500);
        }

        user.save();

        return res.status(200).json({ updateDate: updateDate });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
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

        if (!user) {
            return res.sendStatus(500);
        }

        if (!id) {
            return res.sendStatus(400);
        }

        if (!user.ownProgram(id)) {
            return res.sendStatus(401);
        }

        const values = {
            name: name ?? undefined,
            description: description ?? undefined,
            exercises: exercises ?? undefined,
            trainings: trainings ?? undefined,
            goal: goal ?? undefined,
        };

        await updateProgramById(id, values);

        const updateDate: number = user.refreshProgramsUpdateDate();
        user.save();

        return res.status(200).json({ updateDate: updateDate });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getMyPrograms = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user } = req.body;

        if (!user) {
            return res.status(500).json({
                error: "User is null or undefined in the request body.",
            });
        }

        const programsIds = user.programs;
        const programsArray = [];
        for (const id of programsIds) {
            programsArray.push(await getProgramById(id));
        }

        res.status(200).json({ programs: programsArray });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
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
        return res.sendStatus(400);
    }
};
