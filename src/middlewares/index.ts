import express from "express";

import { IUser, getUserBySessionToken } from "../db/users";

export const isAuthenticated = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        req.body.user = undefined;

        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return res.status(401).json({
                error: "Authorization header couldn't be found in the request.",
            });
        }

        const splitAuthorizationHeader = authorizationHeader.split(" ");

        if (
            splitAuthorizationHeader.length != 2 ||
            splitAuthorizationHeader[0] != "Bearer"
        ) {
            return res
                .status(401)
                .json({ error: "Incorrect authorization header." });
        }

        const token = splitAuthorizationHeader[1];

        const existingUser = await getUserBySessionToken(token);

        if (!existingUser) {
            return res
                .status(401)
                .json({ error: "No user found with the token." });
        }

        req.body.user = existingUser;

        return next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Server-side exception thrown during authentication.",
        });
    }
};

export const isAdmin = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        const user = req.body.user as IUser;

        if (!user) {
            console.log(
                "Authentication middleware did not correctly pass a user to the administrator role checking middleware."
            );
            return res.status(500).json({
                error: "Authentication middleware did not correctly pass a user to the administrator role checking middleware.",
            });
        }

        if (!user.admin) {
            console.log(
                `User with email '${user.email}' tried to use an administrator route without being an administrator.`
            );
            return res
                .status(403)
                .json({ error: "User is not an administrator." });
        }

        return next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Server-side exception thrown while checking administrator role.",
        });
    }
};
