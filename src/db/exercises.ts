import mongoose from "mongoose";

interface IExercise {
    names?: Record<string, string>;
    descriptions?: Record<string, string>;
    muscles?: mongoose.Types.ObjectId[];
    muscleGroup?: mongoose.Types.ObjectId;
    image?: string;
}

const exerciseSchema = new mongoose.Schema<IExercise>({
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

export const ExerciseModel = mongoose.model<IExercise>(
    "Exercise",
    exerciseSchema
);

export const getExercises = () => ExerciseModel.find();
export const getExerciseByName = (name: string) =>
    ExerciseModel.findOne({ name: name });
export const getExerciseById = (id: string) => ExerciseModel.findById(id);
export const createExercise = (values: Record<string, any>) =>
    new ExerciseModel(values).save().then((exercise) => exercise._id);
export const deleteExerciseById = (id: string) =>
    ExerciseModel.findByIdAndDelete(id);
export const updateExerciseById = (id: string, values: Record<string, any>) =>
    ExerciseModel.findByIdAndUpdate(id, values);

export const addMuscleGroupToExerciseByIds = (
    exerciseId: string,
    muscleGroupId: string
) =>
    ExerciseModel.findByIdAndUpdate(exerciseId, {
        $push: { muscleGroup: muscleGroupId },
    });
export const removeMuscleGroupFromExerciseByIds = (
    exerciseId: string,
    muscleGroupId: string
) =>
    ExerciseModel.findByIdAndUpdate(exerciseId, {
        $pullAll: { muscleGroup: muscleGroupId },
    });
