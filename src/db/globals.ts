import mongoose from "mongoose";

interface IPublicLastUpdates {
    aliments: number;
    exercises: number;
    muscleGroups: number;
    muscles: number;
}

interface IGlobal {
    name: string;
    value: any;
}

interface IGlobalMethods {}

interface IGlobalModel extends mongoose.Model<IGlobal, {}, IGlobalMethods> {
    getPublicLastUpdates(): Promise<IPublicLastUpdates>;
    refreshAlimentsLastUpdateAndSave(): Promise<number>;
    refreshExercisesLastUpdateAndSave(): Promise<number>;
    refreshMuscleGroupsLastUpdateAndSave(): Promise<number>;
    refreshMusclesLastUpdateAndSave(): Promise<number>;
}

const globalSchema = new mongoose.Schema<IGlobal, IGlobalModel, IGlobalMethods>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        value: {
            type: mongoose.Schema.Types.Mixed,
        },
    }
);

globalSchema.statics.getPublicLastUpdates = async function () {
    return this.findOne({ name: "publicLastUpdates" }).then(
        (publicLastUpdates) => publicLastUpdates?.value as object
    );
};
globalSchema.statics.refreshAlimentsLastUpdateAndSave = async function () {
    const alimentsLastUpdate = Date.now();
    await this.findByIdAndUpdate(
        { name: "publicLastUpdates" },
        { $set: { "value.aliments": alimentsLastUpdate } }
    );
    return alimentsLastUpdate;
};
globalSchema.statics.refreshExercisesLastUpdateAndSave = async function () {
    const exercisesLastUpdate = Date.now();
    await this.findOneAndUpdate(
        { name: "publicLastUpdates" },
        { $set: { "value.exercises": exercisesLastUpdate } }
    );
    return exercisesLastUpdate;
};
globalSchema.statics.refreshMuscleGroupsLastUpdateAndSave = async function () {
    const muscleGroupsLastUpdate = Date.now();
    await this.findOneAndUpdate(
        { name: "publicLastUpdates" },
        { $set: { "value.muscleGroups": muscleGroupsLastUpdate } }
    );
    return muscleGroupsLastUpdate;
};
globalSchema.statics.refreshMusclesLastUpdateAndSave = async function () {
    const musclesLastUpdate = Date.now();
    await this.findOneAndUpdate(
        { name: "publicLastUpdates" },
        { $set: { "value.muscles": musclesLastUpdate } }
    );
    return musclesLastUpdate;
};

export const GlobalModel = mongoose.model<IGlobal, IGlobalModel>(
    "Global",
    globalSchema
);

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
