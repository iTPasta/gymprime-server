import express from "express";
import mongoose from "mongoose";
import { createRecipe, deleteRecipeById, getRecipeById, getRecipes, updateRecipeById } from "../db/recipes";
import { addUserRecipe, removeUserRecipe } from "../db/users";

export const getRecipe = async (req: express.Request, res: express.Response) => {
    try {
        const { user } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        const { id } = req.params;

        if (!id) {
            return res.sendStatus(400);
        }

        const userRecipesIds: mongoose.Types.ObjectId[] = user.recipes;

        if (!userRecipesIds.some((userRecipeId) => userRecipeId.toString() === id)) {
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
}

export const makeRecipe = async (req: express.Request, res: express.Response) => {
    try {
        const {
            user,
            name,
            description,
            ingredients
        } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        const recipe = await createRecipe({
            name: name ?? undefined,
            description: description ?? undefined,
            ingredients: ingredients ?? undefined
        });

        await addUserRecipe(user._id, recipe._id);

        return res.status(200).json(recipe);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteRecipe = async (req: express.Request, res: express.Response) => {
    try {
        const { user } = req.body;
        const { id } = req.params;

        if (!user) {
            return res.sendStatus(500);
        }

        if (!id) {
            return res.sendStatus(400);
        }

        const userRecipesIds: mongoose.Types.ObjectId[] = user.recipes;

        if (!userRecipesIds.some((userRecipeId) => userRecipeId.toString() === id)) {
            return res.sendStatus(401);
        }

        const recipe = await getRecipeById(id);

        if (!recipe) {
            return res.sendStatus(400);
        }

        await removeUserRecipe(user._id, id);
        await deleteRecipeById(id);

        return res.status(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateRecipe = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const {
            user,
            name,
            description,
            ingredients
        } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        if (!id) {
            return res.sendStatus(400);
        }

        const userRecipesIds: mongoose.Types.ObjectId[] = user.recipes;

        if (!userRecipesIds.some((userRecipeId) => userRecipeId.toString() === id)) {
            return res.sendStatus(401);
        }

        const values = {
            name: name ?? undefined,
            description: description ?? undefined,
            ingredients: ingredients ?? undefined
        };

        const updatedRecipe = await updateRecipeById(id, values);

        return res.status(200).json(updatedRecipe);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getMyRecipes = async (req: express.Request, res: express.Response) => {
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
}

export const getAllRecipes = async (req: express.Request, res: express.Response) => {
    try {
        const recipes = await getRecipes();

        return res.status(200).json(recipes);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}