import express from "express";
import mongoose from "mongoose";
import { createDiet, deleteDietById, getDietById, getDiets, updateDietById } from "../db/diets";
import { addUserDiet, removeUserDiet } from "../db/users";

export const getDiet = async (req: express.Request, res: express.Response) => {
    try {
        const user = req.body.user;

        if (!user) {
            return res.sendStatus(500);
        }

        const id = req.params.id;

        if (!id) {
            return res.sendStatus(400);
        }

        const userDietsIds: mongoose.Types.ObjectId[] = user.diets;

        if (!userDietsIds.some((userDietId) => userDietId.toString() === id)) {
            return res.sendStatus(401);
        }

        const diet = await getDietById(id);

        if (!diet) {
            return res.sendStatus(404);
        }

        return res.status(200).json(diet);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const makeDiet = async (req: express.Request, res: express.Response) => {
    try {
        const { user, name, description, meals } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        const diet = await createDiet({
            name: name ?? undefined,
            description: description ?? undefined,
            meals: meals ?? undefined
        });

        await addUserDiet(user._id, diet._id);

        return res.status(200).json(diet);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteDiet = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { user } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        if (!id) {
            return res.sendStatus(400);
        }

        const userDietsIds: mongoose.Types.ObjectId[] = user.diets;

        if (!userDietsIds.some((userDietId) => userDietId.toString() === id)) {
            return res.sendStatus(401);
        }

        const diet = await getDietById(id);

        if (!diet) {
            return res.sendStatus(400);
        }

        await removeUserDiet(user._id, id);
        await deleteDietById(id);

        return res.status(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateDiet = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { user, name, description, meals } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        if (!id) {
            return res.sendStatus(400);
        }

        const userDietsIds: mongoose.Types.ObjectId[] = user.diets;

        if (!userDietsIds.some((userDietId) => userDietId.toString() === id)) {
            return res.sendStatus(401);
        }

        const values = {
            name: name ?? undefined,
            description: description ?? undefined,
            meals: meals ?? undefined
        };

        const updatedDiet = await updateDietById(id, values);

        return res.status(200).json(updatedDiet);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getMyDiets = async (req: express.Request, res: express.Response) => {
    try {
        const { user } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        const dietsIds = user.diets.toObject();
        const dietsArray = [];
        for (const id of dietsIds) {
            dietsArray.push(await getDietById(id));
        }

        return res.status(200).json(dietsArray);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getAllDiets = async (req: express.Request, res: express.Response) => {
    try {
        const diets = await getDiets();

        return res.status(200).json(diets);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}