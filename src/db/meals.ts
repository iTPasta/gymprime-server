import mongoose from "mongoose";

enum Unit {
    Kilogram = "kg",
    Gram = "g",
    Milligram = "mg",
}

interface IMeal {
    name?: string;
    description?: string;
    aliments?: {
        aliment: mongoose.Types.ObjectId;
        quantity: number;
        unit: Unit;
    }[];
    recipes?: {
        recipe: mongoose.Types.ObjectId;
        quantity: number;
    }[];
}

const mealSchema = new mongoose.Schema<IMeal>({
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
                unit: { type: String, enum: ["kg", "g", "mg"], required: true },
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

export const MealModel = mongoose.model<IMeal>("Meal", mealSchema);

export const getMeals = () => MealModel.find();
export const getMealById = (id: string) => MealModel.findById(id);
export const createMeal = (values: Record<string, any>) =>
    new MealModel(values).save().then((meal) => meal._id);
export const deleteMealById = (id: string) => MealModel.findByIdAndDelete(id);
export const updateMealById = (id: string, values: Record<string, any>) =>
    MealModel.findByIdAndUpdate(id, values);

export const addAlimentToMealByIds = (mealId: string, alimentId: string) =>
    MealModel.findByIdAndUpdate(mealId, { $push: { aliments: alimentId } });
export const removeAlimentFromMealByIds = (mealId: string, alimentId: string) =>
    MealModel.findByIdAndUpdate(mealId, {
        $pullAll: { aliments: alimentId },
    });

export const addRecipeToMealByIds = (mealId: string, recipeId: string) =>
    MealModel.findByIdAndUpdate(mealId, { $push: { recipes: recipeId } });
export const removeRecipeFromMealByIds = (mealId: string, recipeId: string) =>
    MealModel.findByIdAndUpdate(mealId, { $pullAll: { recipes: recipeId } });
