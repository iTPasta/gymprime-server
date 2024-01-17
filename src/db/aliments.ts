import mongoose from "mongoose"

interface IAliment {
    bar_code: string,
    name: string,
    ciqual_code?: number,
    allergens?: string,
    brands?: string,
    country_lc?: string,
    ecoscore_grade?: string,
    ecoscore_score?: number,
    image_url?: string,
    nutriments: {
        energy?: number,
        carbohydrates?: number,
        sugars?: number,
        proteins?: number,
        fats?: number,
        satured_fats?: number,
        salt?: number
    },
    nutriscore_grade?: string,
    nutriscore_score?: number
}

const alimentSchema = new mongoose.Schema<IAliment>({
    bar_code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    ciqual_code: { type: Number, required: false },
    allergens: {type: [String], required: false},
    brands: {type: String, required: false},
    country_lc: {type: String, required: false},
    ecoscore_grade: {type: String, required: false},
    ecoscore_score: {type: Number, required: false},
    image_url: {type: String, required: false},
    nutriments: {
        energy: { type: Number, required: false },
        carbohydrates: { type: Number, required: false },
        sugars: { type: Number, required: false },
        proteins: { type: Number, required: false },
        fats: { type: Number, required: false },
        satured_fats: { type: Number, required: false },
        salt: { type: Number, required: false }
    },
    nutriscore_grade: { type: String, required: false },
    nutriscore_score: { type: Number, required: false }
})

export const AlimentModel = mongoose.model<IAliment>('Aliment', alimentSchema);

export const getAliments = () => AlimentModel.find();
export const getAlimentByBarcode = (bar_code: string) => AlimentModel.findOne({ bar_code: bar_code });
export const getAlimentById = (id: string) => AlimentModel.findById(id);
export const createAliment = (values: Record<string, any>) => new AlimentModel(values)
.save().then((aliment) => aliment.toObject());
export const deleteAlimentById = (id: string) => AlimentModel.findOneAndDelete( {_id: id} );
export const updateAlimentById = (id: string, values: Record<string, any>) => AlimentModel.findByIdAndUpdate(id, { $set: values } )
.then((aliment) => aliment ? aliment.toObject() : null);