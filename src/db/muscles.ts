import mongoose from "mongoose";

interface IMuscle {
    names?: Record<string, string>;
    descriptions?: Record<string, string>;
    exercises?: mongoose.Types.ObjectId[];
    muscleGroup?: mongoose.Types.ObjectId;
    image?: string;
}

const muscleSchema = new mongoose.Schema<IMuscle>({
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
            { type: mongoose.Types.ObjectId, ref: "Exercise", required: true },
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

export const MuscleModel = mongoose.model<IMuscle>("Muscle", muscleSchema);

export const getMuscles = () => MuscleModel.find();
export const getMuscleByName = (name: string) =>
    MuscleModel.findOne({ name: name });
export const getMuscleById = (id: string) => MuscleModel.findById(id);
export const createMuscle = (values: Record<string, any>) =>
    new MuscleModel(values).save().then((muscle) => muscle._id);
export const deleteMuscleById = (id: string) =>
    MuscleModel.findByIdAndDelete(id);
export const updateMuscleById = (id: string, values: Record<string, any>) =>
    MuscleModel.findByIdAndUpdate(id, values);

export const addExerciseToMuscleByIds = (
    muscleId: string,
    exerciseId: string
) => {
    MuscleModel.findByIdAndUpdate(muscleId, {
        $push: { exercises: exerciseId },
    });
};

export const removeExerciseFromMuscleByIds = (
    muscleId: string,
    exerciseId: string
) => {
    MuscleModel.findByIdAndUpdate(muscleId, {
        $pullAll: { exercises: exerciseId },
    });
};
