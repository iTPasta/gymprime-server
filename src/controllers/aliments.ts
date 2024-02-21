import {
    IAliment,
    INutriments,
    createAliment,
    deleteAlimentById,
    getAlimentById,
    getAliments,
    updateAlimentById,
} from "../db/aliments";
import express from "express";
import { GlobalModel } from "../db/globals";

export const getAliment = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params as { id: string };

        if (!id) {
            return res
                .status(400)
                .json({ error: "No id parameter found in the request." });
        }

        const aliment = await getAlimentById(id);

        if (!aliment) {
            return res.status(404).json({
                error: "Database does not contain any aliment corresponding to the provided id.",
            });
        }

        return res.status(200).json({ aliment: aliment });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
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
        } = req.body as {
            barCode: IAliment["barCode"];
            name: IAliment["name"];
            ciqualCode: IAliment["ciqualCode"];
            allergens: IAliment["allergens"];
            brands: IAliment["brands"];
            countryLc: IAliment["countryLc"];
            ecoscoreGrade: IAliment["ecoscoreGrade"];
            ecoscoreScore: IAliment["ecoscoreScore"];
            imageUrl: IAliment["imageUrl"];
            nutriments: IAliment["nutriments"];
            nutriscoreGrade: IAliment["nutriscoreGrade"];
            nutriscoreScore: IAliment["nutriscoreScore"];
        };

        if (!barCode || !name) {
            return res.status(400).json({
                error: "Missing barCode or name in the body of the request.",
            });
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

        const alimentsLastUpdate =
            await GlobalModel.refreshAlimentsLastUpdateAndSave();

        return res.status(201).json({
            alimentId: alimentId,
            alimentsLastUpdate: alimentsLastUpdate,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const deleteAliment = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params as { id: string };

        if (!id) {
            return res
                .status(400)
                .json({ error: "No id parameter found in the request." });
        }

        await deleteAlimentById(id);

        const alimentsLastUpdate =
            await GlobalModel.refreshAlimentsLastUpdateAndSave();

        return res.status(200).json({ alimentsLastUpdate: alimentsLastUpdate });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
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
        } = req.body as {
            barCode: IAliment["barCode"];
            name: IAliment["name"];
            ciqualCode: IAliment["ciqualCode"];
            allergens: IAliment["allergens"];
            brands: IAliment["brands"];
            countryLc: IAliment["countryLc"];
            ecoscoreGrade: IAliment["ecoscoreGrade"];
            ecoscoreScore: IAliment["ecoscoreScore"];
            imageUrl: IAliment["imageUrl"];
            nutriments: IAliment["nutriments"];
            nutriscoreGrade: IAliment["nutriscoreGrade"];
            nutriscoreScore: IAliment["nutriscoreScore"];
        };

        if (!id || !barCode || !name) {
            return res.status(400).json({
                error: "Missing id in request parameters, or barCode and name in the request body.",
            });
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

        const alimentsLastUpdate =
            await GlobalModel.refreshAlimentsLastUpdateAndSave();

        return res.status(200).json({ alimentsLastUpdate: alimentsLastUpdate });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const getAllAliments = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const aliments = getAliments();

        return res.status(200).json({ aliments: aliments });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};
