import mongoose from "mongoose";

interface IProgram {
    name?: string;
    description?: string;
    exercises?: mongoose.Types.ObjectId[];
    trainings?: mongoose.Types.ObjectId[];
    goal?: {
        repetitions: number;
        weight: number;
        exercise: mongoose.Types.ObjectId;
    }[];
}

const programSchema = new mongoose.Schema<IProgram>({
    name: { type: String, required: false },
    description: { type: String, required: false },
    exercises: {
        type: [
            { type: mongoose.Types.ObjectId, ref: "Exercise", required: true },
        ],
        default: () => [],
        required: false,
    },
    trainings: {
        type: [
            { type: mongoose.Types.ObjectId, ref: "Training", required: true },
        ],
        default: () => [],
        required: false,
    },
    goal: {
        type: [
            {
                repetitions: {
                    type: Number,
                    min: 0,
                    required: true,
                    validate: {
                        validator: Number.isInteger,
                        message: "{VALUE} is not an integer value.",
                    },
                },
                weight: { type: Number, min: 0, required: true },
                exercise: { type: mongoose.Types.ObjectId, required: true },
            },
        ],
        default: () => [],
        required: false,
    },
});

export const ProgramModel = mongoose.model<IProgram>("Program", programSchema);

export const getPrograms = () => ProgramModel.find();
export const getProgramById = (id: string) => ProgramModel.findById(id);
export const createProgram = (values: Record<string, any>) =>
    new ProgramModel(values).save().then((program) => program._id);
export const deleteProgramById = (id: string) =>
    ProgramModel.findByIdAndDelete(id);
export const updateProgramById = (id: string, values: Record<string, any>) =>
    ProgramModel.findByIdAndUpdate(id, values);

export const addExerciseToProgramByIds = (
    programId: string,
    exerciseId: string
) =>
    ProgramModel.findByIdAndUpdate(programId, {
        $push: { exercises: exerciseId },
    });
export const removeExerciseFromProgramByIds = (
    programId: string,
    exerciseId: string
) =>
    ProgramModel.findByIdAndUpdate(programId, {
        $pullAll: { exercises: exerciseId },
    });

export const addTrainingToProgramByIds = (
    programId: string,
    trainingId: string
) =>
    ProgramModel.findByIdAndUpdate(programId, {
        $push: { trainings: trainingId },
    });
export const removeTrainingFromProgramByIds = (
    programId: string,
    trainingId: string
) =>
    ProgramModel.findByIdAndUpdate(programId, {
        $pullAll: { trainings: trainingId },
    });
