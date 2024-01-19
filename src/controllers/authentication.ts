import express from 'express';

import { createUser, getUserByEmail } from '../db/users';
import { random, authentication } from '../helpers'

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Body of the request doesn't contain all the needed informations." }).end();
        }

        const user = await getUserByEmail(email).select("+authentication.salt +authentication.password");

        if (!user) {
            return res.status(400).json({ error: "User not found with this email." });
        }

        const expectedHash = authentication(user.authentication.salt, password);
    
        if (user.authentication.password !== expectedHash) {
            return res.status(403).json({ error: "Incorrect password." }).end();
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();
    
        return res.status(200).json({ token: user.authentication.sessionToken }).end();
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "Exception thrown." }).end();
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Body of the request doesn't contain all the needed informations." }).end();
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({ error: "A user is already registered with this email." }).end();
        }

        const salt = random();
        await createUser({
            email,
            authentication: {
                salt,
                password : authentication(salt, password)
            }
        });

        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(500).json({ error: "The user wasn't registered correctly." }).end();
        }

        const tokenSalt = random();
        user.authentication.sessionToken = authentication(tokenSalt, user._id.toString());

        await user.save();

        return res.status(201).json({ token: user.authentication.sessionToken }).end();
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "Exception thrown." }).end();
    }
}