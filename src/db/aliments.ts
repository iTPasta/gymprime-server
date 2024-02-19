import mongoose from "mongoose";

interface IAliment {
    barCode: string;
    name: string;
    ciqualCode?: number;
    allergens?: string;
    brands?: string;
    countryLc?: string;
    ecoscoreGrade?: string;
    ecoscoreScore?: number;
    imageUrl?: string;
    nutriments: {
        energy?: number;
        carbohydrates?: number;
        sugars?: number;
        proteins?: number;
        fats?: number;
        saturedFats?: number;
        salt?: number;
    };
    nutriscoreGrade?: string;
    nutriscoreScore?: number;
}

interface IAlimentMethods {}

interface IAlimentModel extends mongoose.Model<IAliment, {}, IAlimentMethods> {}

const alimentSchema = new mongoose.Schema<
    IAliment,
    IAlimentModel,
    IAlimentMethods
>({
    barCode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    ciqualCode: { type: Number, required: false },
    allergens: { type: [String], required: false },
    brands: { type: String, required: false },
    countryLc: { type: String, required: false },
    ecoscoreGrade: { type: String, required: false },
    ecoscoreScore: { type: Number, required: false },
    imageUrl: { type: String, required: false },
    nutriments: {
        energy: { type: Number, required: false },
        carbohydrates: { type: Number, required: false },
        sugars: { type: Number, required: false },
        proteins: { type: Number, required: false },
        fats: { type: Number, required: false },
        saturedFats: { type: Number, required: false },
        salt: { type: Number, required: false },
    },
    nutriscoreGrade: { type: String, required: false },
    nutriscoreScore: { type: Number, required: false },
});

export const AlimentModel = mongoose.model<IAliment, IAlimentModel>(
    "Aliment",
    alimentSchema
);

export const getAliments = () => AlimentModel.find();
export const getAlimentByBarcode = (barCode: string) =>
    AlimentModel.findOne({ barCode: barCode });
export const getAlimentById = (id: string) => AlimentModel.findById(id);
export const createAliment = (values: Record<string, any>) =>
    new AlimentModel(values).save().then((aliment) => aliment._id);

export const deleteAlimentById = (id: string) =>
    AlimentModel.findByIdAndDelete(id);
export const updateAlimentById = (id: string, values: Record<string, any>) =>
    AlimentModel.findByIdAndUpdate(id, values);
