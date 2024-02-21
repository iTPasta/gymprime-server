import mongoose from "mongoose";
import { WeightUnit } from "../helpers/enums";

export interface IMeal extends mongoose.Document {
    name?: string;
    description?: string;
    aliments?: {
        aliment: mongoose.Types.ObjectId;
        quantity: number;
        unit: WeightUnit;
    }[];
    recipes?: {
        recipe: mongoose.Types.ObjectId;
        quantity: number;
    }[];
}

interface IMealModel extends mongoose.Model<IMeal> {}

const mealSchema = new mongoose.Schema<IMeal, IMealModel>({
    name: { type: String, required: false },
    description: { type: String, required: false },
    aliments: {
        type: [
            {
                aliment: {
                    type: mongoose.Types.ObjectId,
                    ref: "Aliment",
                    required: true,
                },
                quantity: { type: Number, min: 0, required: true },
                unit: { type: String, enum: WeightUnit, required: true },
            },
        ],
        required: false,
    },
    recipes: {
        type: [
            {
                recipe: {
                    type: mongoose.Types.ObjectId,
                    ref: "Recipe",
                    required: true,
                },
                quantity: { type: Number, min: 0, required: true },
            },
        ],
        required: false,
    },
});

export const MealModel = mongoose.model<IMeal, IMealModel>("Meal", mealSchema);

export const getMeals = () => MealModel.find();

export const checkMealExistenceById = (id: string | mongoose.Types.ObjectId) =>
    MealModel.exists({ _id: id });

export const getMealById = (id: string | mongoose.Types.ObjectId) =>
    MealModel.findById(id);

export const createMeal = (values: Record<string, any>) =>
    new MealModel(values).save().then((meal) => meal._id);

export const deleteMealById = (id: string | mongoose.Types.ObjectId) =>
    MealModel.findByIdAndDelete(id);

export const updateMealById = (
    id: string | mongoose.Types.ObjectId,
    values: Record<string, any>
) => MealModel.findByIdAndUpdate(id, values);

export const addAlimentToMealByIds = (
    mealId: string | mongoose.Types.ObjectId,
    alimentId: string
) => MealModel.findByIdAndUpdate(mealId, { $push: { aliments: alimentId } });
export const removeAlimentFromMealByIds = (
    mealId: string | mongoose.Types.ObjectId,
    alimentId: string
) =>
    MealModel.findByIdAndUpdate(mealId, {
        $pullAll: { aliments: alimentId },
    });

export const addRecipeToMealByIds = (
    mealId: string | mongoose.Types.ObjectId,
    recipeId: string | mongoose.Types.ObjectId
) => MealModel.findByIdAndUpdate(mealId, { $push: { recipes: recipeId } });
export const removeRecipeFromMealByIds = (
    mealId: string | mongoose.Types.ObjectId,
    recipeId: string | mongoose.Types.ObjectId
) => MealModel.findByIdAndUpdate(mealId, { $pullAll: { recipes: recipeId } });
