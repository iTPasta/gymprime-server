import mongoose from "mongoose"

interface IMuscle {
    names: Record<string, string>,
    descriptions: Record<string, string>,
    exercises: mongoose.Types.ObjectId[],
    muscle_group?: mongoose.Types.ObjectId,
    image?: string
}

const muscleSchema = new mongoose.Schema<IMuscle>({
    names: {
        type: Map,
        of: String,
        required: true
    },
    descriptions: {
        type: Map,
        of: String,
        default: () => {}
    },
    exercises: {
        type: [{ type: mongoose.Types.ObjectId, ref: "Exercise", required: true }],
        default: () => []
    },
    muscle_group: {
        type: mongoose.Types.ObjectId,
        ref: "MuscleGroup",
        default: () => null
    },
    image: {
        type: String,
        default: () => null
    }
});

export const MuscleModel = mongoose.model<IMuscle>("Muscle", muscleSchema)

export const getMuscles = () => MuscleModel.find();
export const getMuscleByName = (name: string) => MuscleModel.findOne({ name: name });
export const getMuscleById = (id: string) => MuscleModel.findById(id);
export const createMuscle = (values: Record<string, any>) => new MuscleModel(values)
.save().then((muscle) => muscle.toObject());
export const deleteMuscleById = (id: string) => MuscleModel.findOneAndDelete( {_id: id} );
export const updateMuscleById = (id: string, values: Record<string, any>) => MuscleModel.findByIdAndUpdate(id, { $set: values }, { new: true })
.then((muscle) => muscle ? muscle.toObject() : null);;

export const addExerciseToMuscleByIds = (muscle_id: string, exercise_id: string) => { MuscleModel.findByIdAndUpdate(
    muscle_id, { $push: { exercises: exercise_id } }
)};

export const removeExerciseFromMuscleByIds = (muscle_id: string, exercise_id: string) => { MuscleModel.findByIdAndUpdate(
    muscle_id, { $pullAll: { exercises: exercise_id } }
)};