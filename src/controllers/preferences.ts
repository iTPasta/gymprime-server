import express from "express";
import { IUser } from "../db/users";

export const getMyPreferences = async (
    req: express.Request,
    res: express.Response
) => {
    const { user } = req.body as { user: IUser };

    const preferences = user.preferences;

    return res.status(200).json({ preferences: preferences });
};
