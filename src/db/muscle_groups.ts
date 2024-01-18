import mongoose from "mongoose";

interface IMuscleGroup {
    name: Record<string, string>,
    description: Record<string, string>,
    muscles: mongoose.Types.ObjectId[],
    image?: string
}

const muscleGroupSchema = new mongoose.Schema<IMuscleGroup>({
    name: {
        type: Map,
        of: String,
        required: true
    },
    description: {
        type: Map,
        of: String,
        default: () => {}
    },
    muscles: {
        type: [{ type: mongoose.Types.ObjectId, ref: "Muscle", required: true }],
        default: () => []
    },
    image: {
        type: String,
        default: () => null
    }
});

export const MuscleGroupModel = mongoose.model<IMuscleGroup>("MuscleGroup", muscleGroupSchema);

export const getMuscleGroups = () => MuscleGroupModel.find();
export const getMuscleGroupByName = (name: string) => MuscleGroupModel.findOne({ name: name });
export const getMuscleGroupById = (id: string) => MuscleGroupModel.findById(id);
export const createMuscleGroup = (values: Record<string, any>) => new MuscleGroupModel(values)
.save().then((muscleGroup) => muscleGroup.toObject());
export const deleteMuscleGroupById = (id: string) => MuscleGroupModel.findOneAndDelete( {_id: id} );
export const updateMuscleGroupById = (id: string, values: Record<string, any>) => MuscleGroupModel.findByIdAndUpdate(id, { $set: values }, { new: true })
.then((muscleGroup) => muscleGroup ? muscleGroup.toObject() : null);

export const addMuscleToGroupByIds = (muscle_group_id: string, muscle_id: string) => { MuscleGroupModel.findByIdAndUpdate(
    muscle_group_id, { $push: { muscles: muscle_id } }
)};
export const removeMuscleFromGroupByIds = (muscle_group_id: string, muscle_id: string) => { MuscleGroupModel.findByIdAndUpdate(
    muscle_group_id, { $pullAll: { muscles: muscle_id } }
)};