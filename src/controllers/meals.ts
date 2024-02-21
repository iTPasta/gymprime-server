import express from "express";
import mongoose from "mongoose";
import {
    IMeal,
    MealModel,
    addAlimentToMealByIds,
    addRecipeToMealByIds,
    checkMealExistenceById,
    createMeal,
    deleteMealById,
    getMealById,
    getMeals,
    removeAlimentFromMealByIds,
    removeRecipeFromMealByIds,
    updateMealById,
} from "../db/meals";
import { getAlimentById } from "../db/aliments";
import { getRecipeById } from "../db/recipes";
import { IUser } from "../db/users";

export const getMeal = async (req: express.Request, res: express.Response) => {
    try {
        const { user } = req.body as { user: IUser };

        const { id } = req.params as { id: string };

        if (!id) {
            return res
                .status(400)
                .json({ error: "No id parameter found in the request." });
        }

        if (!user.ownMeal(id)) {
            return res
                .status(401)
                .json({ error: "User does not own the requested meal." });
        }

        const meal = await getMealById(id);

        if (!meal) {
            return res.status(400).json({
                error: "Database does not contain any meal corresponding to the provided id.",
            });
        }

        return res.status(200).json({ meal: meal });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const makeMeal = async (req: express.Request, res: express.Response) => {
    try {
        const { user, name, description, aliments, recipes } = req.body as {
            user: IUser;
            name: IMeal["name"];
            description: IMeal["description"];
            aliments: IMeal["aliments"];
            recipes: IMeal["recipes"];
        };

        const mealId = await createMeal({
            name: name ?? undefined,
            description: description ?? undefined,
            aliments: aliments ?? undefined,
            recipes: recipes ?? undefined,
        });

        const mealsLastUpdate: number = user.addMeal(mealId);
        await user.save();

        return res
            .status(200)
            .json({ mealId: mealId, mealsLastUpdate: mealsLastUpdate });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const deleteMeal = async (
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

        if (!user.ownMeal(id)) {
            return res.status(401).json({
                error: "User does not own the meal corresponding to the provided id.",
            });
        }

        if (!checkMealExistenceById(id)) {
            return res.status(400).json({
                error: "Database does not contain any meal corresponding to the provided id.",
            });
        }

        await deleteMealById(id);

        const mealsLastUpdate: number = user.removeMeal(id);
        await user.save();

        return res.status(200).json({ mealsLastUpdate: mealsLastUpdate });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const updateMeal = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params as { id: string };
        const { user, name, description, aliments, recipes } = req.body as {
            user: IUser;
            name: IMeal["name"];
            description: IMeal["description"];
            aliments: IMeal["aliments"];
            recipes: IMeal["recipes"];
        };

        if (!id) {
            return res
                .status(400)
                .json({ error: "No id parameter found in the request." });
        }

        if (!user.ownMeal(id)) {
            return res.status(401).json({
                error: "User does not own the meal corresponding to the provided id.",
            });
        }

        if (!checkMealExistenceById(id)) {
            return res.status(400).json({
                error: "Database does not contain any meal corresponding to the provided id.",
            });
        }

        const values = {
            name: name ?? undefined,
            description: description ?? undefined,
            aliments: aliments ?? undefined,
            recipes: recipes ?? undefined,
        };

        await updateMealById(id, values);

        const mealsLastUpdate: number = user.refreshMealsLastUpdate();
        await user.save();

        return res.status(200).json({ mealsLastUpdate: mealsLastUpdate });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const addAlimentToMeal = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { mealId } = req.params as { mealId: string };
        const { user, alimentId } = req.body as {
            user: IUser;
            alimentId: string;
        };

        if (!mealId || !alimentId) {
            return res.status(400).json({
                error: "Missing mealId in request parameters, or alimentId in request body.",
            });
        }

        if (!user.ownMeal(mealId)) {
            return res.status(401).json({
                error: "User does not own the meal corresponding to the provided mealId.",
            });
        }

        const aliment = await getAlimentById(alimentId);

        if (!aliment) {
            return res.status(400).json({
                error: "Database does not contain any aliment corresponding to the provided alimentId.",
            });
        }

        const meal = await getMealById(mealId);

        if (!meal) {
            return res.status(400).json({
                error: "Database does not contain any meal corresponding to the provided mealId.",
            });
        }

        await addAlimentToMealByIds(mealId, alimentId);

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const removeAlimentFromMeal = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { mealId } = req.params as { mealId: string };
        const { user, alimentId } = req.body as {
            user: IUser;
            alimentId: string;
        };

        if (!mealId || !alimentId) {
            return res.status(400).json({
                error: "Missing mealId in request parameters, or alimentId in request body.",
            });
        }

        if (!user.ownMeal(mealId)) {
            return res.status(401).json({
                error: "User does not own the meal corresponding to the provided mealId.",
            });
        }

        const meal = await getMealById(mealId);

        if (!meal) {
            return res.status(400).json({
                error: "Database does not contain any meal corresponding to the provided mealId.",
            });
        }

        await removeAlimentFromMealByIds(mealId, alimentId);

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const addRecipeToMeal = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { mealId } = req.params as { mealId: string };
        const { user, recipeId } = req.body as {
            user: IUser;
            recipeId: string;
        };

        if (!mealId || !recipeId) {
            return res.sendStatus(400);
        }

        if (!user.ownMeal(mealId)) {
            return res.status(401).json({
                error: "User does not own the meal corresponding to the provided mealId.",
            });
        }

        const recipe = await getRecipeById(recipeId);

        if (!recipe) {
            return res.sendStatus(400);
        }

        if (!user.ownRecipe(recipeId)) {
            return res.status(401).json({
                error: "User does not own the recipe corresponding to the provided recipeId.",
            });
        }

        const meal = await getMealById(mealId);

        if (!meal) {
            return res.sendStatus(400);
        }

        await addRecipeToMealByIds(mealId, recipeId);

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const removeRecipeFromMeal = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { mealId } = req.params as { mealId: string };
        const { user, recipeId } = req.body as {
            user: IUser;
            recipeId: string;
        };

        if (!mealId || !recipeId) {
            return res.sendStatus(400);
        }

        if (!user.ownMeal(mealId)) {
            return res.status(401).json({
                error: "User does not own the meal corresponding to the provided mealId.",
            });
        }

        const meal = await getMealById(mealId);

        if (!meal) {
            return res.sendStatus(400);
        }

        await removeRecipeFromMealByIds(mealId, recipeId);

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const getMyMeals = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user } = req.body as { user: IUser };

        const mealsIds = user.meals;
        const meals = [];
        for (const id of mealsIds) {
            meals.push(await getMealById(id));
        }

        const mealsLastUpdate = user.lastUpdates.meals;

        res.status(200).json({
            meals: meals,
            mealsLastUpdate: mealsLastUpdate,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const getAllMeals = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const meals = await getMeals();

        return res.status(200).json({ meals: meals });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};
