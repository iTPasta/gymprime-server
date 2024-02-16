import mongoose from "mongoose";

interface IMuscleGroup {
    names?: Record<string, string>;
    descriptions?: Record<string, string>;
    muscles?: mongoose.Types.ObjectId[];
    image?: string;
}

const muscleGroupSchema = new mongoose.Schema<IMuscleGroup>({
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
    image: {
        type: String,
        required: false,
    },
});

export const MuscleGroupModel = mongoose.model<IMuscleGroup>(
    "MuscleGroup",
    muscleGroupSchema
);

export const getMuscleGroups = () => MuscleGroupModel.find();
export const getMuscleGroupByName = (name: string) =>
    MuscleGroupModel.findOne({ name: name });
export const getMuscleGroupById = (id: string) => MuscleGroupModel.findById(id);
export const createMuscleGroup = (values: Record<string, any>) =>
    new MuscleGroupModel(values).save().then((muscleGroup) => muscleGroup._id);
export const deleteMuscleGroupById = (id: string) =>
    MuscleGroupModel.findByIdAndDelete(id);
export const updateMuscleGroupById = (
    id: string,
    values: Record<string, any>
) => MuscleGroupModel.findByIdAndUpdate(id, values);

export const addMuscleToGroupByIds = (
    muscleGroupId: string,
    muscleId: string
) => {
    MuscleGroupModel.findByIdAndUpdate(muscleGroupId, {
        $push: { muscles: muscleId },
    });
};
export const removeMuscleFromGroupByIds = (
    muscleGroupId: string,
    muscleId: string
) => {
    MuscleGroupModel.findByIdAndUpdate(muscleGroupId, {
        $pullAll: { muscles: muscleId },
    });
};
