import mongoose from "mongoose";

enum Unit {
    Kilogram = "kg",
    Gram = "g",
    Milligram = "mg",
}

interface IRecipe {
    name?: string;
    description?: string;
    ingredients?: {
        aliment: mongoose.Types.ObjectId;
        quantity: number;
        unit: Unit;
    }[];
}

const recipeSchema = new mongoose.Schema<IRecipe>({
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
                unit: { type: String, enum: ["kg", "g", "mg"], required: true },
            },
        ],
        default: () => [],
        required: false,
    },
});

export const RecipeModel = mongoose.model<IRecipe>("Recipe", recipeSchema);

export const getRecipes = () => RecipeModel.find();
export const getRecipeById = (id: string) => RecipeModel.findById(id);
export const createRecipe = (values: Record<string, any>) =>
    new RecipeModel(values).save().then((recipe) => recipe._id);
export const deleteRecipeById = (id: string) =>
    RecipeModel.findByIdAndDelete(id);
export const updateRecipeById = (id: string, values: Record<string, any>) =>
    RecipeModel.findByIdAndUpdate(id, values);

export const addIngredientToRecipeByIds = (
    recipeId: string,
    ingredient: object
) =>
    RecipeModel.findByIdAndUpdate(recipeId, {
        $push: { ingredients: ingredient },
    });
export const removeIngredientFromRecipeByIds = (
    recipeId: string,
    ingredient: object
) =>
    RecipeModel.findByIdAndUpdate(recipeId, {
        $pullAll: { ingredients: ingredient },
    });
