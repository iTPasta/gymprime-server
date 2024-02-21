import mongoose from "mongoose";

export interface IMuscle extends mongoose.Document {
    names?: Record<string, string>;
    descriptions?: Record<string, string>;
    exercises?: mongoose.Types.ObjectId[];
    muscleGroup?: mongoose.Types.ObjectId;
    image?: string;
}

interface IMuscleModel extends mongoose.Model<IMuscle> {}

const muscleSchema = new mongoose.Schema<IMuscle, IMuscleModel>({
    names: {
        type: Map,
        of: String,
        default: () => {},
        required: false,
    },
    descriptions: {
        type: Map,
        of: String,
        default: () => {},
        required: false,
    },
    exercises: {
        type: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Exercise",
                required: true,
            },
        ],
        default: () => [],
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

export const MuscleModel = mongoose.model<IMuscle, IMuscleModel>(
    "Muscle",
    muscleSchema
);

export const getMuscles = () => MuscleModel.find();

export const checkMuscleExistenceById = (
    id: string | mongoose.Types.ObjectId
) => MuscleModel.exists({ _id: id });

export const getMuscleById = (id: string | mongoose.Types.ObjectId) =>
    MuscleModel.findById(id);

export const getMuscleByName = (name: string) =>
    MuscleModel.findOne({ name: name });

export const createMuscle = (values: Record<string, any>) =>
    new MuscleModel(values).save().then((muscle) => muscle._id);

export const deleteMuscleById = (id: string | mongoose.Types.ObjectId) =>
    MuscleModel.findByIdAndDelete(id);

export const updateMuscleById = (
    id: string | mongoose.Types.ObjectId,
    values: Record<string, any>
) => MuscleModel.findByIdAndUpdate(id, values);

export const addExerciseToMuscleByIds = (
    muscleId: string | mongoose.Types.ObjectId,
    exerciseId: string | mongoose.Types.ObjectId
) => {
    MuscleModel.findByIdAndUpdate(muscleId, {
        $push: { exercises: exerciseId },
    });
};

export const removeExerciseFromMuscleByIds = (
    muscleId: string | mongoose.Types.ObjectId,
    exerciseId: string | mongoose.Types.ObjectId
) => {
    MuscleModel.findByIdAndUpdate(muscleId, {
        $pullAll: { exercises: exerciseId },
    });
};
