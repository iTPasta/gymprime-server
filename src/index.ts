import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router/index";

// TODO: optimisation avec entre checkExistence et get/update/delete/create

const app = express();

app.use(
    cors({
        credentials: true,
    })
);

app.use(compression());
app.use(bodyParser.json());

const server = http.createServer(app);

const PORT = Number(process.env.SERVER_PORT);

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/.`);
});

const DATABASE_URI = process.env.DATABASE_URI ?? "";
console.log(`Connecting to the database at ${DATABASE_URI}.`);

mongoose.Promise = Promise;
mongoose.connect(DATABASE_URI);
mongoose.connection.on("error", (error: Error) => console.log(error));
mongoose.connection.once("open", () =>
    console.log("Connected to the database.")
);

app.use("/", router());
