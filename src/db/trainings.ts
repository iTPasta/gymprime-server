import mongoose from "mongoose";

interface ITraining {
    name?: string;
    date: number;
    notes?: string;
    sets?: {
        repetitions: number;
        weight: number;
        exercise: mongoose.Types.ObjectId;
    }[];
}

const trainingSchema = new mongoose.Schema<ITraining>({
    name: { type: String, required: false },
    date: { type: Number, immutable: true, required: true },
    notes: { type: String, required: false },
    sets: {
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

export const TrainingModel = mongoose.model<ITraining>(
    "Training",
    trainingSchema
);

export const getTrainings = () => TrainingModel.find();
export const getTrainingById = (id: string) => TrainingModel.findById(id);
export const createTraining = (values: Record<string, any>) =>
    new TrainingModel(values).save().then((training) => training._id);
export const deleteTrainingById = (id: string) =>
    TrainingModel.findByIdAndDelete(id);
export const updateTrainingById = (id: string, values: Record<string, any>) =>
    TrainingModel.findByIdAndUpdate(id, values);

export const addSetToTrainingByIds = (trainingId: string, set: object) =>
    TrainingModel.findByIdAndUpdate(trainingId, { $push: { sets: set } });
export const removeSetFromTrainingByIds = (trainingId: string, set: object) =>
    TrainingModel.findByIdAndUpdate(trainingId, { $pullAll: { sets: set } });
