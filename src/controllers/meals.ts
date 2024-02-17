import express from "express";
import mongoose from "mongoose";
import {
    addAlimentToMealByIds,
    addRecipeToMealByIds,
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

export const getMeal = async (req: express.Request, res: express.Response) => {
    try {
        const user = req.body.user;

        if (!user) {
            return res.sendStatus(500);
        }

        const id = req.params.id;

        if (!id) {
            return res.sendStatus(400);
        }

        if (!user.ownMeal(id)) {
            return res.sendStatus(401);
        }

        const meal = await getMealById(id);

        if (!meal) {
            return res.sendStatus(400);
        }

        return res.status(200).json({ meal: meal });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const makeMeal = async (req: express.Request, res: express.Response) => {
    try {
        const { user, name, description, aliments, recipes } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        const mealId = await createMeal({
            name: name ?? undefined,
            description: description ?? undefined,
            aliments: aliments ?? undefined,
            recipes: recipes ?? undefined,
        });

        const mealsLastUpdate: number = user.addMeal();

        if (!mealsLastUpdate) {
            return res.sendStatus(500);
        }

        await user.save();

        return res
            .status(200)
            .json({ mealId: mealId, mealsLastUpdate: mealsLastUpdate });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const deleteMeal = async (
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

        if (!user.ownMeal(id)) {
            return res.sendStatus(401);
        }

        const meal = await getMealById(id);

        if (!meal) {
            return res.sendStatus(400);
        }

        await deleteMealById(id);

        const mealsLastUpdate: number = user.refreshMealsLastUpdate(id);

        if (!mealsLastUpdate) {
            return res.sendStatus(500);
        }

        await user.save();

        return res.status(200).json({ mealsLastUpdate: mealsLastUpdate });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const updateMeal = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const { user, name, description, aliments, recipes } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        if (!id) {
            return res.sendStatus(400);
        }

        if (!user.ownMeal(id)) {
            return res.sendStatus(401);
        }

        const values = {
            name: name ?? undefined,
            description: description ?? undefined,
            aliments: aliments ?? undefined,
            recipes: recipes ?? undefined,
        };

        await updateMealById(id, values);

        const mealsLastUpdate: number = user.refreshMealsLastUpdate();
        user.save();

        return res.status(200).json({ mealsLastUpdate: mealsLastUpdate });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const addAlimentToMeal = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const { user, alimentId } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        if (!id || !alimentId) {
            return res.sendStatus(400);
        }

        if (!user.ownMeal(id)) {
            return res.sendStatus(401);
        }

        const aliment = await getAlimentById(alimentId);

        if (!aliment) {
            return res.sendStatus(400);
        }

        const meal = await getMealById(id);

        if (!meal) {
            return res.sendStatus(400);
        }

        await addAlimentToMealByIds(id, alimentId);

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const removeAlimentFromMeal = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const { user, alimentId } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        if (!id || !alimentId) {
            return res.sendStatus(400);
        }

        if (!user.ownMeal(id)) {
            return res.sendStatus(401);
        }

        const meal = await getMealById(id);

        if (!meal) {
            return res.sendStatus(400);
        }

        await removeAlimentFromMealByIds(id, alimentId);

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const addRecipeToMeal = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const mealId = req.params.id;
        const { user, recipeId } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        if (!mealId || !recipeId) {
            return res.sendStatus(400);
        }

        if (!user.ownMeal(mealId)) {
            return res.sendStatus(401);
        }

        const recipe = await getRecipeById(recipeId);

        if (!recipe) {
            return res.sendStatus(400);
        }

        if (!user.ownRecipe(recipeId)) {
            return res.sendStatus(401);
        }

        const meal = await getMealById(mealId);

        if (!meal) {
            return res.sendStatus(400);
        }

        await addRecipeToMealByIds(mealId, recipeId);

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const removeRecipeFromMeal = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const mealId = req.params.id;
        const { user, recipeId } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        if (!mealId || !recipeId) {
            return res.sendStatus(400);
        }

        if (!user.ownMeal(mealId)) {
            return res.sendStatus(401);
        }

        const meal = await getMealById(mealId);

        if (!meal) {
            return res.sendStatus(400);
        }

        await removeRecipeFromMealByIds(mealId, recipeId);

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getMyMeals = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        const mealsIds = user.meals.toObject();
        const mealsArray = [];
        for (const id of mealsIds) {
            mealsArray.push(await getMealById(id));
        }

        res.status(200).json(mealsArray);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getAllMeals = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const meals = await getMeals();

        return res.status(200).json(meals);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
