import express from "express";

export const getMyPreferences = async (
    req: express.Request,
    res: express.Response
) => {
    const { user } = req.body;

    const preferences = user.preferences;

    return res.status(200).json({ preferences: preferences });
};
