import mongoose from "mongoose";

export interface IMuscleGroup extends mongoose.Document {
    names?: Record<string, string>;
    descriptions?: Record<string, string>;
    muscles?: mongoose.Types.ObjectId[];
    image?: string;
}

interface IMuscleGroupModel extends mongoose.Model<IMuscleGroup> {}

const muscleGroupSchema = new mongoose.Schema<IMuscleGroup, IMuscleGroupModel>({
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

export const MuscleGroupModel = mongoose.model<IMuscleGroup, IMuscleGroupModel>(
    "MuscleGroup",
    muscleGroupSchema
);

export const getMuscleGroups = () => MuscleGroupModel.find();

export const checkMuscleGroupExistenceById = (
    id: string | mongoose.Types.ObjectId
) => MuscleGroupModel.exists({ _id: id });

export const getMuscleGroupByName = (name: string) =>
    MuscleGroupModel.findOne({ name: name });

export const getMuscleGroupById = (id: string | mongoose.Types.ObjectId) =>
    MuscleGroupModel.findById(id);

export const createMuscleGroup = (values: Record<string, any>) =>
    new MuscleGroupModel(values).save().then((muscleGroup) => muscleGroup._id);

export const deleteMuscleGroupById = (id: string | mongoose.Types.ObjectId) =>
    MuscleGroupModel.findByIdAndDelete(id);

export const updateMuscleGroupById = (
    id: string,
    values: Record<string, any>
) => MuscleGroupModel.findByIdAndUpdate(id, values);

export const addMuscleToGroupByIds = (
    muscleGroupId: string | mongoose.Types.ObjectId,
    muscleId: string | mongoose.Types.ObjectId
) => {
    MuscleGroupModel.findByIdAndUpdate(muscleGroupId, {
        $push: { muscles: muscleId },
    });
};
export const removeMuscleFromGroupByIds = (
    muscleGroupId: string | mongoose.Types.ObjectId,
    muscleId: string | mongoose.Types.ObjectId
) => {
    MuscleGroupModel.findByIdAndUpdate(muscleGroupId, {
        $pullAll: { muscles: muscleId },
    });
};
