import mongoose from "mongoose";

interface IProgram {
    name: string,
    description: string,
    exercises: mongoose.Types.ObjectId[],
    trainings: mongoose.Types.ObjectId[],
    goal: {
        type: {
            repetitions: number,
            weight: number,
            exercise: mongoose.Types.ObjectId
        }[],
        default: () => []
    }
}

const programSchema = new mongoose.Schema<IProgram>({
    name: { type: String, default: () => "" },
    description: { type: String, default: () => "" },
    exercises: {
        type: [{ type: mongoose.Types.ObjectId, ref: "Exercise", required: true }],
        default: () => []
    },
    trainings: {
        type: [{ type: mongoose.Types.ObjectId, ref: "Training", required: true }],
        default: () => []
    },
    goal: {
        type: [{
            repetitions: {
                type: Number,
                min: 0,
                required: true,
                validate: {
                    validator: Number.isInteger,
                    message: '{VALUE} is not an integer value.'
                }
            },
            weight: { type: Number, min: 0, required: true },
            exercise: { type: mongoose.Types.ObjectId, required: true }
        }],
        default: () => []
    }
});

export const ProgramModel = mongoose.model<IProgram>("Program", programSchema);

export const getPrograms = () => ProgramModel.find();
export const getProgramById = (id: string) => ProgramModel.findById(id);
export const createProgram = (values: Record<string, any>) => new ProgramModel(values)
    .save().then((program) => program.toObject());
export const deleteProgramById = (id: string) => ProgramModel.findOneAndDelete( {_id: id} );
export const updateProgramById = (id: string, values: Record<string, any>) => ProgramModel.findByIdAndUpdate(id, { $set: values }, { new: true })
.then((program) => program ? program.toObject() : null);;

export const addExerciseToProgramByIds = (program_id: string, exercise_id: string) => ProgramModel.findByIdAndUpdate(
    program_id, { $push: { exercises: exercise_id }
});
export const removeExerciseFromProgramByIds = (program_id: string, exercise_id: string) => ProgramModel.findByIdAndUpdate(
    program_id, { $pullAll: { exercises: exercise_id }
});

export const addTrainingToProgramByIds = (program_id: string, training_id: string) => ProgramModel.findByIdAndUpdate(
    program_id, { $push: { trainings: training_id }
});
export const removeTrainingFromProgramByIds = (program_id: string, training_id: string) => ProgramModel.findByIdAndUpdate(
    program_id, { $pullAll: { trainings: training_id }
});