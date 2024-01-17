import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router/index';


const app = express();

app.use(cors({
    credentials: true
}));

app.use(compression());
app.use(bodyParser.json());

const server = http.createServer(app);

const PORT = Number(process.env.SERVER_PORT);

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/.`);
})

const DATABASE_PORT = Number(process.env.DATABASE_PORT);
const DATABASE_URL = process.env.DATABASE_URL ?? "";

mongoose.Promise = Promise;
mongoose.connect(DATABASE_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));
mongoose.connection.once('open', () => console.log("Connected to the database."));

app.use('/', router());