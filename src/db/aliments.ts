import mongoose from "mongoose";

export interface INutriments {
    energy?: number;
    carbohydrates?: number;
    sugars?: number;
    proteins?: number;
    fats?: number;
    saturedFats?: number;
    salt?: number;
}

export interface IAliment extends mongoose.Document {
    barCode: string;
    name: string;
    ciqualCode?: number;
    allergens?: string;
    brands?: string;
    countryLc?: string;
    ecoscoreGrade?: string;
    ecoscoreScore?: number;
    imageUrl?: string;
    nutriments: INutriments;
    nutriscoreGrade?: string;
    nutriscoreScore?: number;
}

interface IAlimentModel extends mongoose.Model<IAliment> {}

const alimentSchema = new mongoose.Schema<IAliment, IAlimentModel>({
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

export const checkAlimentExistenceById = (
    id: string | mongoose.Types.ObjectId
) => AlimentModel.exists({ _id: id });

export const checkAlimentExistenceByBarcode = (barCode: string) =>
    AlimentModel.exists({ barCode: barCode });

export const getAlimentById = (id: string | mongoose.Types.ObjectId) =>
    AlimentModel.findById(id);

export const getAlimentByBarcode = (barCode: string) =>
    AlimentModel.findOne({ barCode: barCode });

export const createAliment = (values: Record<string, any>) =>
    new AlimentModel(values).save().then((aliment) => aliment._id);

export const deleteAlimentById = (id: string | mongoose.Types.ObjectId) =>
    AlimentModel.findByIdAndDelete(id);

export const updateAlimentById = (
    id: string | mongoose.Types.ObjectId,
    values: Record<string, any>
) => AlimentModel.findByIdAndUpdate(id, values);
