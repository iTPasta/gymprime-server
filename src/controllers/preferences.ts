import express from "express";

export const getMyPreferences = async (req: express.Request, res: express.Response) => {
    const { user } = req.body;

    if (!user) {
        return res.sendStatus(500);
    }

    return res.status(200).json(user.preferences);
}