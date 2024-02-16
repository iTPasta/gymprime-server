import mongoose from "mongoose";

interface IDiet {
    name?: string;
    description?: string;
    meals?: mongoose.Types.ObjectId[];
}

const dietSchema = new mongoose.Schema<IDiet>({
    name: { type: String, required: false },
    description: { type: String, required: false },
    meals: {
        type: [{ type: mongoose.Types.ObjectId, ref: "Meal", required: true }],
        required: false,
    },
});

export const DietModel = mongoose.model<IDiet>("Diet", dietSchema);

export const getDiets = () => DietModel.find();
export const getDietById = (id: string) => DietModel.findById(id);
export const createDiet = (values: Record<string, any>) =>
    new DietModel(values).save().then((diet) => diet._id);
export const deleteDietById = (id: string) => DietModel.findByIdAndDelete(id);
export const updateDietById = (id: string, values: Record<string, any>) =>
    DietModel.findByIdAndUpdate(id, values);

export const addMealToDietByIds = (dietId: string, mealId: string) =>
    DietModel.findByIdAndUpdate(dietId, { $push: { meals: mealId } });
export const removeMealFromDietByIds = (dietId: string, mealId: string) =>
    DietModel.findByIdAndUpdate(dietId, { $pullAll: { meals: mealId } });
