import express from "express";

import {
    createUser,
    getUserByEmail,
    getUserByUsername,
    getUserByValidationSecret,
} from "../db/users";
import {
    random,
    authentication,
    isEmailValid,
    checkPasswordSecurity,
} from "../helpers";

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { username, email, password } = req.body;

        if ((!username && !email) || !password) {
            return res.status(400).json({
                error: "Body of the request doesn't contain all the needed informations.",
            });
        }

        const user = email
            ? await getUserByEmail(email).select(
                  "+authentication.salt +authentication.password"
              )
            : await getUserByUsername(username).select(
                  "+authentication.salt +authentication.password"
              );

        if (!user) {
            return res
                .status(400)
                .json({ error: "User not found with this email." });
        }

        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password !== expectedHash) {
            return res.status(403).json({ error: "Incorrect password." });
        }

        const salt = random();
        user.authentication.sessionToken = authentication(
            salt,
            user._id.toString()
        );

        await user.save();

        return res
            .status(200)
            .json({ token: user.authentication.sessionToken });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                error: "Body of the request doesn't contain all the needed informations.",
            });
        }

        if (!isEmailValid(email)) {
            return res.status(400).json({ error: "Invalid email." });
        }

        if (!checkPasswordSecurity(password)) {
            return res
                .status(400)
                .json({ error: "Password is not strong enough." });
        }

        const salt = random();
        await createUser({
            username,
            email,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });

        const user = await getUserByEmail(email);

        if (!user) {
            return res
                .status(500)
                .json({ error: "The user wasn't registered correctly." });
        }

        const tokenSalt = random();
        user.authentication.sessionToken = authentication(
            tokenSalt,
            user._id.toString()
        );

        await user.save();

        return res
            .status(201)
            .json({ token: user.authentication.sessionToken });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const askValidation = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "No email specified." });
        }

        const user = await getUserByEmail(email).select("+accountValidation");

        if (!user) {
            return res.status(400).json({ error: "Unknown email." });
        }

        if (!user.accountValidation) {
            return res
                .status(400)
                .json({ error: "Account already validated." });
        }

        if (Date.now() < user.accountValidation.expiration) {
            return res
                .status(400)
                .json({ error: "A validation link is already available." });
        }

        user.accountValidation = {
            secret: random(),
            expiration: Date.now() + 600000,
        };

        await user.save();

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};

export const validate = async (req: express.Request, res: express.Response) => {
    try {
        const { secret } = req.params;

        if (!secret) {
            return res.status(400).json({ error: "No secret specified." });
        }

        const user = await getUserByValidationSecret(secret).select(
            "+accountalidation"
        );

        if (!user) {
            return res.status(400).json({ error: "Unknown secret." });
        }

        if (!user.accountValidation?.expiration) {
            user.accountValidation = {
                secret: "",
                expiration: Date.now() - 1,
            };
            await user.save();
            return res
                .status(500)
                .json({ error: "Account validation date unavailable, retry." });
        }

        if (user.accountValidation.expiration < Date.now()) {
            return res.status(410).json({ error: "Validation expired." });
        }

        user.accountValidation = undefined;

        await user.save();

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server-side exception thrown." });
    }
};
