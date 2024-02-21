import mongoose from "mongoose";

export interface IDiet extends mongoose.Document {
    name?: string;
    description?: string;
    meals?: mongoose.Types.ObjectId[];
}

interface IDietModel extends mongoose.Model<IDiet> {}

const dietSchema = new mongoose.Schema<IDiet, IDietModel>({
    name: { type: String, required: false },
    description: { type: String, required: false },
    meals: {
        type: [{ type: mongoose.Types.ObjectId, ref: "Meal", required: true }],
        required: false,
    },
});

export const DietModel = mongoose.model<IDiet, IDietModel>("Diet", dietSchema);

export const getDiets = () => DietModel.find();

export const checkDietExistenceById = (id: string | mongoose.Types.ObjectId) =>
    DietModel.exists({ _id: id });

export const getDietById = (id: string | mongoose.Types.ObjectId) =>
    DietModel.findById(id);

export const createDiet = (values: Record<string, any>) =>
    new DietModel(values).save().then((diet) => diet._id);

export const deleteDietById = (id: string | mongoose.Types.ObjectId) =>
    DietModel.findByIdAndDelete(id);

export const updateDietById = (
    id: string | mongoose.Types.ObjectId,
    values: Record<string, any>
) => DietModel.findByIdAndUpdate(id, values);

export const addMealToDietByIds = (
    dietId: string | mongoose.Types.ObjectId,
    mealId: string | mongoose.Types.ObjectId
) => DietModel.findByIdAndUpdate(dietId, { $push: { meals: mealId } });
export const removeMealFromDietByIds = (
    dietId: string | mongoose.Types.ObjectId,
    mealId: string | mongoose.Types.ObjectId
) => DietModel.findByIdAndUpdate(dietId, { $pullAll: { meals: mealId } });
