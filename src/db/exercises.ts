import mongoose from "mongoose";
import { Language } from "../helpers/enums";

export interface IExercise extends mongoose.Document {
    names?: Record<Language, string>;
    descriptions?: Record<Language, string>;
    muscles?: mongoose.Types.ObjectId[];
    muscleGroup?: mongoose.Types.ObjectId;
    image?: string;
}

interface IExerciseModel extends mongoose.Model<IExercise> {}

const exerciseSchema = new mongoose.Schema<IExercise, IExerciseModel>({
    names: {
        type: Map,
        of: String,
        required: false,
    },
    descriptions: {
        type: Map,
        of: String,
        required: false,
    },
    muscles: {
        type: [
            { type: mongoose.Types.ObjectId, ref: "Muscle", required: true },
        ],
        required: false,
    },
    muscleGroup: {
        type: mongoose.Types.ObjectId,
        ref: "MuscleGroup",
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
});

export const ExerciseModel = mongoose.model<IExercise, IExerciseModel>(
    "Exercise",
    exerciseSchema
);

export const getExercises = () => ExerciseModel.find();

export const checkExerciseExistenceById = (
    id: string | mongoose.Types.ObjectId
) => ExerciseModel.exists({ _id: id });

export const getExerciseByName = (name: string) =>
    ExerciseModel.findOne({ name: name });

export const getExerciseById = (id: string | mongoose.Types.ObjectId) =>
    ExerciseModel.findById(id);

export const createExercise = (values: Record<string, any>) =>
    new ExerciseModel(values).save().then((exercise) => exercise._id);

export const deleteExerciseById = (id: string | mongoose.Types.ObjectId) =>
    ExerciseModel.findByIdAndDelete(id);

export const updateExerciseById = (
    id: string | mongoose.Types.ObjectId,
    values: Record<string, any>
) => ExerciseModel.findByIdAndUpdate(id, values);

export const addMuscleGroupToExerciseByIds = (
    exerciseId: string | mongoose.Types.ObjectId,
    muscleGroupId: string | mongoose.Types.ObjectId
) =>
    ExerciseModel.findByIdAndUpdate(exerciseId, {
        $push: { muscleGroup: muscleGroupId },
    });
export const removeMuscleGroupFromExerciseByIds = (
    exerciseId: string | mongoose.Types.ObjectId,
    muscleGroupId: string | mongoose.Types.ObjectId
) =>
    ExerciseModel.findByIdAndUpdate(exerciseId, {
        $pullAll: { muscleGroup: muscleGroupId },
    });
