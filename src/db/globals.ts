import mongoose from "mongoose";

interface IGlobal {
    name: string;
    value: any;
}

const globalSchema = new mongoose.Schema<IGlobal>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
    },
});

export const GlobalModel = mongoose.model<IGlobal>("Global", globalSchema);

export const getGlobals = () => GlobalModel.find();
export const getGlobalByName = (name: string) =>
    GlobalModel.findOne({ name: name });
export const getGlobalById = (id: string) => GlobalModel.findById(id);
export const createGlobal = (values: Record<string, any>) =>
    new GlobalModel(values).save().then((global) => global._id);
export const deleteGlobalById = (id: string) =>
    GlobalModel.findByIdAndDelete(id);
export const updateGlobalById = (id: string, values: Record<string, any>) =>
    GlobalModel.findByIdAndUpdate(id, values);
