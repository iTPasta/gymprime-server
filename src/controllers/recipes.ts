import express from "express";
import mongoose from "mongoose";
import {
    createRecipe,
    deleteRecipeById,
    getRecipeById,
    getRecipes,
    updateRecipeById,
} from "../db/recipes";

export const getRecipe = async (
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

        if (!user.ownRecipe(id)) {
            return res.sendStatus(401);
        }

        const recipe = await getRecipeById(id);

        if (!recipe) {
            return res.sendStatus(400);
        }

        return res.status(200).json(recipe);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const makeRecipe = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user, name, description, ingredients } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        const recipeId = await createRecipe({
            name: name ?? undefined,
            description: description ?? undefined,
            ingredients: ingredients ?? undefined,
        });

        const updateDate: number = user.addRecipe(recipeId);

        if (!updateDate) {
            return res.sendStatus(500);
        }

        await user.save();

        return res
            .status(200)
            .json({ recipeId: recipeId, updateDate: updateDate });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const deleteRecipe = async (
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

        if (!user.ownRecipe(id)) {
            return res.sendStatus(401);
        }

        const recipe = await getRecipeById(id);

        if (!recipe) {
            return res.sendStatus(400);
        }

        await deleteRecipeById(id);

        const updateDate: number = user.removeRecipe(id);

        if (!updateDate) {
            return res.sendStatus(500);
        }

        await user.save();

        return res.status(200).json({ updateDate: updateDate });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const updateRecipe = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const { user, name, description, ingredients } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        if (!id) {
            return res.sendStatus(400);
        }

        if (!user.ownRecipe(id)) {
            return res.sendStatus(401);
        }

        const values = {
            name: name ?? undefined,
            description: description ?? undefined,
            ingredients: ingredients ?? undefined,
        };

        await updateRecipeById(id, values);

        const updateDate: number = user.refreshRecipesUpdateDate();
        user.save();

        return res.send(200).json({ updateDate: updateDate });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getMyRecipes = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        const recipesIds = user.recipes;
        const recipesArray = [];
        for (const id of recipesIds) {
            recipesArray.push(await getRecipeById(id));
        }

        res.status(200).json(recipesArray);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getAllRecipes = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const recipes = await getRecipes();

        return res.status(200).json(recipes);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
