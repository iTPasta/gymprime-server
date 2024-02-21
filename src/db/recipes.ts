import mongoose from "mongoose";
import { WeightUnit } from "../helpers/enums";

export interface IRecipe extends mongoose.Document {
    name?: string;
    description?: string;
    ingredients?: {
        aliment: mongoose.Types.ObjectId;
        quantity: number;
        unit: WeightUnit;
    }[];
}

interface IRecipeModel extends mongoose.Model<IRecipe> {}

const recipeSchema = new mongoose.Schema<IRecipe, IRecipeModel>({
    name: { type: String, required: false },
    description: { type: String, required: false },
    ingredients: {
        type: [
            {
                aliment: {
                    type: mongoose.Types.ObjectId,
                    ref: "Aliment",
                    required: true,
                },
                quantity: { type: Number, min: 0, required: true },
                unit: {
                    type: String,
                    enum: WeightUnit,
                    required: true,
                },
            },
        ],
        default: () => [],
        required: false,
    },
});

export const RecipeModel = mongoose.model<IRecipe, IRecipeModel>(
    "Recipe",
    recipeSchema
);

export const getRecipes = () => RecipeModel.find();

export const checkRecipeExistenceById = (
    id: string | mongoose.Types.ObjectId
) => RecipeModel.exists({ _id: id });

export const getRecipeById = (id: string | mongoose.Types.ObjectId) =>
    RecipeModel.findById(id);

export const createRecipe = (values: Record<string, any>) =>
    new RecipeModel(values).save().then((recipe) => recipe._id);

export const deleteRecipeById = (id: string | mongoose.Types.ObjectId) =>
    RecipeModel.findByIdAndDelete(id);

export const updateRecipeById = (
    id: string | mongoose.Types.ObjectId,
    values: Record<string, any>
) => RecipeModel.findByIdAndUpdate(id, values);

export const addIngredientToRecipeByIds = (
    recipeId: string | mongoose.Types.ObjectId,
    ingredient: object
) =>
    RecipeModel.findByIdAndUpdate(recipeId, {
        $push: { ingredients: ingredient },
    });
export const removeIngredientFromRecipeByIds = (
    recipeId: string | mongoose.Types.ObjectId,
    ingredient: object
) =>
    RecipeModel.findByIdAndUpdate(recipeId, {
        $pullAll: { ingredients: ingredient },
    });
