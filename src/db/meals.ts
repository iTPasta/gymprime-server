import mongoose from "mongoose";

enum Unit {
    Kilogram = "kg",
    Gram = "g",
    Milligram = "mg"
}

interface IMeal {
    name: string,
    description: string,
    aliments: {
        aliment: mongoose.Types.ObjectId,
        quantity: number,
        unit: Unit
    }[],
    recipes: {
        recipe: mongoose.Types.ObjectId,
        quantity: number
    }[]
}

const mealSchema = new mongoose.Schema<IMeal>({
    name: { type: String, default: () => "" },
    description: { type: String, default: () => "" },
    aliments: {
        type: [{
            aliment: { type: mongoose.Types.ObjectId, ref: "Aliment", required: true },
            quantity: { type: Number, min: 0, required: true },
            unit: { type: String, enum: ['kg', 'g', 'mg'], required: true }
        }],
        default: () => []
    },
    recipes: {
        type: [{
            recipe: { type: mongoose.Types.ObjectId, ref: "Recipe", required: true },
            quantity: { type: Number, min: 0, required: true }
        }],
        default: () => []
    }
});

export const MealModel = mongoose.model<IMeal>("Meal", mealSchema);

export const getMeals = () => MealModel.find();
export const getMealById = (id: string) => MealModel.findById(id);
export const createMeal = (values: Record<string, any>) => new MealModel(values)
    .save().then((meal) => meal.toObject());
export const deleteMealById = (id: string) => MealModel.findOneAndDelete( {_id: id} );
export const updateMealById = (id: string, values: Record<string, any>) => MealModel.findByIdAndUpdate(id, { $set: values }, { new: true })
.then((meal) => meal ? meal.toObject() : null);;

export const addAlimentToMealByIds = (meal_id: string, aliment_id: string) => MealModel.findByIdAndUpdate(
    meal_id, { $push: { aliments: aliment_id }
});
export const removeAlimentFromMealByIds = (meal_id: string, aliment_id: string) => MealModel.findByIdAndUpdate(
    meal_id, { $pullAll: { aliments: aliment_id }
});

export const addRecipeToMealByIds = (meal_id: string, recipe_id: string) => MealModel.findByIdAndUpdate(
    meal_id, { $push: { recipes: recipe_id }
});
export const removeRecipeFromMealByIds = (meal_id: string, recipe_id: string) => MealModel.findByIdAndUpdate(
    meal_id, { $pullAll: { recipes: recipe_id }
});