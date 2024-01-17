import mongoose from "mongoose";

enum Unit {
    Kilogram = "kg",
    Gram = "g",
    Milligram = "mg"
}

interface IRecipe {
    name: string,
    description: string,
    ingredients: {
        aliment: mongoose.Types.ObjectId,
        quantity: number,
        unit: Unit
    }[]
}

const recipeSchema = new mongoose.Schema<IRecipe>({
    name: { type: String, default: () => "" },
    description: { type: String, default: () => "" },
    ingredients: {
        type: [{
            aliment: { type: mongoose.Types.ObjectId, ref: "Aliment", required: true },
            quantity: { type: Number, min: 0, required: true },
            unit: { type: String, enum: ['kg', 'g', 'mg'], required: true }
        }],
        default: () => []
    }
});

export const RecipeModel = mongoose.model<IRecipe>('Recipe', recipeSchema);

export const getRecipes = () => RecipeModel.find();
export const getRecipeById = (id: string) => RecipeModel.findById(id);
export const createRecipe = (values: Record<string, any>) => new RecipeModel(values)
    .save().then((recipe) => recipe.toObject());
export const deleteRecipeById = (id: string) => RecipeModel.findOneAndDelete( {_id: id} );
export const updateRecipeById = (id: string, values: Record<string, any>) => RecipeModel.findByIdAndUpdate(id,  { $set: values } )
.then((recipe) => recipe ? recipe.toObject() : null);;

export const addIngredientToRecipeByIds = (recipe_id: string, ingredient: Object) => RecipeModel.findByIdAndUpdate(
    recipe_id, { $push: { ingredients: ingredient }
});
export const removeIngredientFromRecipeByIds = (recipe_id: string, ingredient: Object) => RecipeModel.findByIdAndUpdate(
    recipe_id, { $pullAll: { ingredients: ingredient }
});