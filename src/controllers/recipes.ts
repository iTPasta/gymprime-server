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

        if (!id) {
            return res
                .status(400)
                .json({ error: "No id parameter found in the request." });
        }

        if (!user.ownRecipe(id)) {
            return res
                .status(401)
                .json({ error: "User does not own the requested recipe." });
        }

        const recipe = await getRecipeById(id);

        if (!recipe) {
            return res.status(400).json({
                error: "Database does not contain any recipe corresponding to the provided id.",
            });
        }

        return res.status(200).json({ recipe: recipe });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const makeRecipe = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user, name, description, ingredients } = req.body;

        const recipeId = await createRecipe({
            name: name ?? undefined,
            description: description ?? undefined,
            ingredients: ingredients ?? undefined,
        });

        const recipesLastUpdate: number = user.addRecipe(recipeId);
        await user.save();

        return res
            .status(200)
            .json({ recipeId: recipeId, recipesLastUpdate: recipesLastUpdate });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const deleteRecipe = async (
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

        if (!user.ownRecipe(id)) {
            return res.status(401).json({
                error: "User does not own the recipe corresponding to the provided id.",
            });
        }

        const recipe = await getRecipeById(id);

        if (!recipe) {
            return res.status(400).json({
                error: "Database does not contain any recipe corresponding to the provided id.",
            });
        }

        await deleteRecipeById(id);

        const recipesLastUpdate: number = user.removeRecipe(id);
        await user.save();

        return res.status(200).json({ recipesLastUpdate: recipesLastUpdate });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const updateRecipe = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const { user, name, description, ingredients } = req.body;

        if (!id) {
            return res
                .status(400)
                .json({ error: "No id parameter found in the request." });
        }

        if (!user.ownRecipe(id)) {
            return res.status(401).json({
                error: "User does not own the recipe corresponding to the provided id.",
            });
        }

        const values = {
            name: name ?? undefined,
            description: description ?? undefined,
            ingredients: ingredients ?? undefined,
        };

        await updateRecipeById(id, values);

        const recipesLastUpdate: number = user.refreshRecipesLastUpdate();
        await user.save();

        return res.send(200).json({ recipesLastUpdate: recipesLastUpdate });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const getMyRecipes = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { user } = req.body;

        const recipesIds = user.recipes;
        const recipes = [];
        for (const id of recipesIds) {
            recipes.push(await getRecipeById(id));
        }

        res.status(200).json({ recipes: recipes });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const getAllRecipes = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const recipes = await getRecipes();

        return res.status(200).json({ recipes: recipes });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};
