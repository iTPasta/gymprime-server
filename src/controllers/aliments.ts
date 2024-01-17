import { createAliment, deleteAlimentById, getAlimentById, getAliments, updateAlimentById } from "../db/aliments";
import express from "express";

export const getAliment = async (req: express.Request, res: express.Response) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.sendStatus(400);
        }

        const aliment = await getAlimentById(id);

        if (!aliment) {
            return res.sendStatus(404);
        }

        return res.status(200).json(aliment);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const makeAliment = async (req: express.Request, res: express.Response) => {
    try {
        const {
            bar_code,
            name,
            ciqual_code,
            allergens,
            brands,
            country_lc,
            ecoscore_grade,
            ecoscore_score,
            image_url,
            nutriments,
            nutriscore_grade,
            nutriscore_score
        } = req.body;

        if (!bar_code) {
            return res.sendStatus(400)
        }

        const aliment = await createAliment({
            bar_code: bar_code,
            name: name,
            ciqual_code: ciqual_code ?? undefined,
            allergens: allergens ?? undefined,
            brands: brands ?? undefined,
            country_lc: country_lc ?? undefined,
            ecoscore_grade: ecoscore_grade ?? undefined,
            ecoscore_score: ecoscore_score ?? undefined,
            image_url: image_url ?? undefined,
            nutriments: nutriments ?? undefined,
            nutriscore_grade: nutriscore_grade ?? undefined,
            nutriscore_score: nutriscore_score ?? undefined
        });

        return res.status(200).json(aliment);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const deleteAliment = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.sendStatus(400);
        }

        await deleteAlimentById(id);

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateAliment = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const {
            bar_code,
            name,
            ciqual_code,
            allergens,
            brands,
            country_lc,
            ecoscore_grade,
            ecoscore_score,
            image_url,
            nutriments,
            nutriscore_grade,
            nutriscore_score
        } = req.body;

        if (!id) {
            return res.sendStatus(400);
        }

        const values = {
            bar_code: bar_code ?? undefined,
            name: name ?? undefined,
            ciqual_code: ciqual_code ?? undefined,
            allergens: allergens ?? undefined,
            brands: brands ?? undefined,
            country_lc: country_lc ?? undefined,
            ecoscore_grade: ecoscore_grade ?? undefined,
            ecoscore_score: ecoscore_score ?? undefined,
            image_url: image_url ?? undefined,
            nutriments: nutriments ?? undefined,
            nutriscore_grade: nutriscore_grade ?? undefined,
            nutriscore_score: nutriscore_score ?? undefined
        };

        const updatedAliment = await updateAlimentById(id, values);

        return res.status(200).json(updatedAliment);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getAllAliments = async (req: express.Request, res: express.Response) => {
    try {
        const aliments = getAliments();

        return res.status(200).json(aliments);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}