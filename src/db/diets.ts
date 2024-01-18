import mongoose from "mongoose";

interface IDiet {
    name: string,
    description: string,
    meals: mongoose.Types.ObjectId[]
}

const dietSchema = new mongoose.Schema<IDiet>({
    name: { type: String, default: () => "" },
    description: { type: String, default: () => "" },
    meals: {
        type: [{ type: mongoose.Types.ObjectId, ref: "Meal", required: true }],
        default: () => []
    }
});

export const DietModel = mongoose.model<IDiet>('Diet', dietSchema);

export const getDiets = () => DietModel.find();
export const getDietById = (id: string) => DietModel.findById(id);
export const createDiet = (values: Record<string, any>) => new DietModel(values)
    .save().then((diet) => diet.toObject());
export const deleteDietById = (id: string) => DietModel.findOneAndDelete( {_id: id} );
export const updateDietById = (id: string, values: Record<string, any>) => DietModel.findByIdAndUpdate(id, { $set: values }, { new: true })
.then((diet) => diet ? diet.toObject() : null);

export const addMealToDietByIds = (diet_id: string, meal_id: string) => DietModel.findByIdAndUpdate(
    diet_id, { $push: { meals: meal_id }
});
export const removeMealFromDietByIds = (diet_id: string, meal_id: string) => DietModel.findByIdAndUpdate(
    diet_id, { $pullAll: { meals: meal_id }
});