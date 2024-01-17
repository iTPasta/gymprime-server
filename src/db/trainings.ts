import mongoose from "mongoose";

interface ITraining {
    name: string,
    notes?: string
    sets: {
        repetitions: number
        weight: number
        exercise: mongoose.Types.ObjectId
    }[]
}

const trainingSchema = new mongoose.Schema<ITraining>({
    name: { type: String, default: () => "" },
    notes: { type: String, required: false },
    sets: {
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

export const TrainingModel = mongoose.model<ITraining>("Training", trainingSchema);

export const getTrainings = () => TrainingModel.find();
export const getTrainingById = (id: string) => TrainingModel.findById(id);
export const createTraining = (values: Record<string, any>) => new TrainingModel(values)
    .save().then((training) => training.toObject());
export const deleteTrainingById = (id: string) => TrainingModel.findOneAndDelete( {_id: id} );
export const updateTrainingById = (id: string, values: Record<string, any>) => TrainingModel.findByIdAndUpdate(id, { $set: values } );

export const addSetToTrainingByIds = (training_id: string, set: Object) => TrainingModel.findByIdAndUpdate(
    training_id, { $push: { sets: set }
});
export const removeSetFromTrainingByIds = (training_id: string, set: Object) => TrainingModel.findByIdAndUpdate(
    training_id, { $pullAll: { sets: set }
});