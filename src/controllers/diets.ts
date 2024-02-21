import express from "express";
import {
    IDiet,
    createDiet,
    deleteDietById,
    getDietById,
    getDiets,
    updateDietById,
} from "../db/diets";
import { IUser } from "../db/users";

export const getDiet = async (req: express.Request, res: express.Response) => {
    try {
        const { user } = req.body as { user: IUser };

        const id = req.params.id;

        if (!id) {
            return res
                .status(400)
                .json({ error: "No id parameter found in the request." });
        }

        if (!user.ownDiet(id)) {
            return res
                .status(401)
                .json({ error: "User does not own the requested diet." });
        }

        const diet = await getDietById(id);

        if (!diet) {
            return res.status(404).json({
                error: "Database does not contain any diet corresponding to the provided id.",
            });
        }

        return res.status(200).json({ diet: diet });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const makeDiet = async (req: express.Request, res: express.Response) => {
    try {
        const { user, name, description, meals } = req.body as {
            user: IUser;
            name: IDiet["name"];
            description: IDiet["description"];
            meals: IDiet["meals"];
        };

        const dietId = await createDiet({
            name: name ?? undefined,
            description: description ?? undefined,
            meals: meals ?? undefined,
        });

        const dietsLastUpdate: number = user.addDiet(dietId);
        await user.save();

        return res
            .status(201)
            .json({ dietId: dietId, dietsLastUpdate: dietsLastUpdate });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const deleteDiet = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params as { id: string };
        const { user } = req.body as { user: IUser };

        if (!id) {
            return res
                .status(400)
                .json({ error: "No id parameter found in the request." });
        }

        if (!user.ownDiet(id)) {
            return res.status(401).json({
                error: "User does not own the diet corresponding to the provided id.",
            });
        }

        const diet = await getDietById(id);

        if (!diet) {
            return res.status(404).json({
                error: "Database does not contain any diet corresponding to the provided id.",
            });
        }

        await deleteDietById(id);

        const dietsLastUpdate: number = user.removeDiet(id);
        await user.save();

        return res.status(200).json({ dietsLastUpdate: dietsLastUpdate });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const updateDiet = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params as { id: string };
        const { user, name, description, meals } = req.body as {
            user: IUser;
            name: IDiet["name"];
            description: IDiet["description"];
            meals: IDiet["meals"];
        };

        if (!id) {
            return res
                .status(400)
                .json({ error: "No id parameter found in the request." });
        }

        if (!user.ownDiet(id)) {
            return res.status(401).json({
                error: "User does not own the diet corresponding to the provided id.",
            });
        }

        const values = {
            name: name ?? undefined,
            description: description ?? undefined,
            meals: meals ?? undefined,
        };

        await updateDietById(id, values);

        const dietsLastUpdate: number = user.refreshDietsLastUpdate();
        await user.save();

        return res.status(200).json({ dietsLastUpdate: dietsLastUpdate });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const getMyDiets = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user } = req.body as { user: IUser };

        const dietsIds = user.diets;
        const diets = [];
        for (const id of dietsIds) {
            diets.push(await getDietById(id));
        }

        const dietsLastUpdate: number = user.lastUpdates.diets;

        return res
            .status(200)
            .json({ diets: diets, dietsLastUpdate: dietsLastUpdate });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const getAllDiets = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const diets = await getDiets();

        return res.status(200).json({ diets: diets });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};
