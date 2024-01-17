import express from "express";
import { addAlimentToMealByIds, addRecipeToMealByIds, createMeal, deleteMealById, getMealById, getMeals, removeAlimentFromMealByIds, removeRecipeFromMealByIds, updateMealById } from "../db/meals";
import { getAlimentById } from "../db/aliments";
import { getRecipeById } from "../db/recipes";
import { addUserMeal, removeUserMeal } from "../db/users";

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

        const userMealsIds = user.meals;

        if (!userMealsIds.includes(id)) {
            return res.sendStatus(401);
        }

        const meal = await getMealById(id);

        if (!meal) {
            return res.sendStatus(400);
        }

        return res.status(200).json(meal);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const makeMeal = async (req: express.Request, res: express.Response) => {
    try {
        const { user, name, description, aliments, recipes } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        const meal = await createMeal({
            name: name ?? undefined,
            description: description ?? undefined,
            aliments: aliments ?? undefined,
            recipes: recipes ?? undefined
        });

        await addUserMeal(user._id, meal._id);

        return res.status(200).json(meal);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteMeal = async (req: express.Request, res: express.Response) => {
    try {
        const { user } = req.body;
        const { id } = req.params;

        if (!user) {
            return res.sendStatus(500);
        }

        if (!id) {
            return res.sendStatus(400);
        }

        const userMealsIds = user.meals;

        if (!userMealsIds.includes(id)) {
            return res.sendStatus(401);
        }

        const meal = await getMealById(id);

        if (!meal) {
            return res.sendStatus(400);
        }

        await removeUserMeal(user._id, id);
        await deleteMealById(id);

        return res.status(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateMeal = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { user, name, description, aliments, recipes } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        if (!id) {
            return res.sendStatus(400);
        }

        const userMealsIds = user.meals;

        if (!userMealsIds.includes(id)) {
            return res.sendStatus(401);
        }

        const values = {
            name: name ?? undefined,
            description: description ?? undefined,
            aliments: aliments ?? undefined,
            recipes: recipes ?? undefined
        };

        const updatedMeal = await updateMealById(id, values);

        return res.status(200).json(updatedMeal);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const addAlimentToMeal = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { user, aliment_id } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        if (!id || !aliment_id) {
            return res.sendStatus(400);
        }

        const userMealsIds = user.meals;

        if (!userMealsIds.includes(id)) {
            return res.sendStatus(401);
        }

        const aliment = await getAlimentById(aliment_id);

        if (!aliment) {
            return res.sendStatus(400);
        }

        const meal = await getMealById(id);

        if (!meal) {
            return res.sendStatus(400);
        }

        await addAlimentToMealByIds(id, aliment_id);
    
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const removeAlimentFromMeal = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { user, aliment_id } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        if (!id || !aliment_id) {
            return res.sendStatus(400);
        }

        const userMealsIds = user.meals;

        if (!userMealsIds.includes(id)) {
            return res.sendStatus(401);
        }

        const meal = await getMealById(id);

        if (!meal) {
            return res.sendStatus(400);
        }

        await removeAlimentFromMealByIds(id, aliment_id);
    
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const addRecipeToMeal = async (req: express.Request, res: express.Response) => {
    try {
        const meal_id = req.params.id;
        const { user, recipe_id } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        if (!meal_id || !recipe_id) {
            return res.sendStatus(400);
        }

        const userMealsIds = user.meals;

        if (!userMealsIds.includes(meal_id)) {
            return res.sendStatus(401);
        }

        const recipe = await getRecipeById(recipe_id);

        if (!recipe) {
            return res.sendStatus(400);
        }

        const meal = await getMealById(meal_id);

        if (!meal) {
            return res.sendStatus(400);
        }

        await addRecipeToMealByIds(meal_id, recipe_id);
    
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const removeRecipeFromMeal = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { user, recipe_id } = req.body;

        if (!user) {
            return res.sendStatus(500);
        }

        if (!id || !recipe_id) {
            return res.sendStatus(400);
        }

        const userMealsIds = user.meals;

        if (!userMealsIds.includes(id)) {
            return res.sendStatus(401);
        }

        const meal = await getMealById(id);

        if (!meal) {
            return res.sendStatus(400);
        }

        await removeRecipeFromMealByIds(id, recipe_id);
    
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getMyMeals = async (req: express.Request, res: express.Response) => {
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
}

export const getAllMeals = async (req: express.Request, res: express.Response) => {
    try {
        const meals = await getMeals();

        return res.status(200).json(meals);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}