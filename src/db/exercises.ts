import mongoose from "mongoose";

interface IExercise {
    name: Record<string, string>,
    description: Record<string, string>,
    muscles: mongoose.Types.ObjectId[],
    muscle_group?: mongoose.Types.ObjectId,
    image?: string
}

const exerciseSchema = new mongoose.Schema<IExercise>({
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

export const ExerciseModel = mongoose.model<IExercise>('Exercise', exerciseSchema);

export const getExercises = () => ExerciseModel.find();
export const getExerciseByName = (name: string) => ExerciseModel.findOne({ name: name });
export const getExerciseById = (id: string) => ExerciseModel.findById(id);
export const createExercise = (values: Record<string, any>) => new ExerciseModel(values)
    .save().then((exercise) => exercise.toObject());
export const deleteExerciseById = (id: string) => ExerciseModel.findOneAndDelete( {_id: id} );
export const updateExerciseById = (id: string, values: Record<string, any>) => ExerciseModel.findByIdAndUpdate(id, { $set: values }, { new: true })
.then((exercise) => exercise ? exercise.toObject() : null);;

export const addMuscleGroupToExerciseByIds = (exercise_id: string, muscle_group_id: string) => ExerciseModel.findByIdAndUpdate(
    exercise_id, { $push: { muscle_group: muscle_group_id }
});
export const removeMuscleGroupFromExerciseByIds = (exercise_id: string, muscle_group_id: string) => ExerciseModel.findByIdAndUpdate(
    exercise_id, { $pullAll: { muscle_group: muscle_group_id }
});