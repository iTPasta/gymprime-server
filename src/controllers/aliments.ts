import {
    createAliment,
    deleteAlimentById,
    getAlimentById,
    getAliments,
    updateAlimentById,
} from "../db/aliments";
import express from "express";

export const getAliment = async (
    req: express.Request,
    res: express.Response
) => {
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
};

export const makeAliment = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const {
            barCode,
            name,
            ciqualCode,
            allergens,
            brands,
            countryLc,
            ecoscoreGrade,
            ecoscoreScore,
            imageUrl,
            nutriments,
            nutriscoreGrade,
            nutriscoreScore,
        } = req.body;

        if (!barCode || !name) {
            return res.sendStatus(400);
        }

        const alimentId = await createAliment({
            barCode: barCode,
            name: name,
            ciqualCode: ciqualCode ?? undefined,
            allergens: allergens ?? undefined,
            brands: brands ?? undefined,
            countryLc: countryLc ?? undefined,
            ecoscoreGrade: ecoscoreGrade ?? undefined,
            ecoscoreScore: ecoscoreScore ?? undefined,
            imageUrl: imageUrl ?? undefined,
            nutriments: nutriments ?? undefined,
            nutriscoreGrade: nutriscoreGrade ?? undefined,
            nutriscoreScore: nutriscoreScore ?? undefined,
        });

        return res.status(200).json(alimentId);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const deleteAliment = async (
    req: express.Request,
    res: express.Response
) => {
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
};

export const updateAliment = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const {
            barCode,
            name,
            ciqualCode,
            allergens,
            brands,
            countryLc,
            ecoscoreGrade,
            ecoscoreScore,
            imageUrl,
            nutriments,
            nutriscoreGrade,
            nutriscoreScore,
        } = req.body;

        if (!id || !barCode || !name) {
            return res.sendStatus(400);
        }

        const values = {
            barCode: barCode,
            name: name,
            ciqualCode: ciqualCode ?? undefined,
            allergens: allergens ?? undefined,
            brands: brands ?? undefined,
            countryLc: countryLc ?? undefined,
            ecoscoreGrade: ecoscoreGrade ?? undefined,
            ecoscoreScore: ecoscoreScore ?? undefined,
            imageUrl: imageUrl ?? undefined,
            nutriments: nutriments ?? undefined,
            nutriscoreGrade: nutriscoreGrade ?? undefined,
            nutriscoreScore: nutriscoreScore ?? undefined,
        };

        await updateAlimentById(id, values);

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getAllAliments = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const aliments = getAliments();

        return res.status(200).json(aliments);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};
