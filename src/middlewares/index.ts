import express from 'express';

import { getUserBySessionToken } from '../db/users';

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        req.body.user = undefined;

        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return res.status(401).json( { error: "Authorization header couldn't be found." } ).end();
        }

        const splitAuthorizationHeader = authorizationHeader.split(' ');

        if (splitAuthorizationHeader.length != 2 || splitAuthorizationHeader[0] != "Bearer") {
            return res.status(401).json( { error: "Incorrect authorization header." } ).end();
        }

        const token = splitAuthorizationHeader[1];

        const existingUser = await getUserBySessionToken(token);

        if (!existingUser) {
            return res.status(401).json({ error: "No user found with the token." }).end();
        }

        req.body.user = existingUser;

        return next();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400).end();
    }
}

export const isAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const user = req.body.user;

        if (!user) {
            return res.status(500).json("").end();
        }

        if (!user.admin) {
            return res.status(403).json({ error: "The user isn't an administrator." }).end();
        }

        return next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "Exception thrown." }).end();
    }
}