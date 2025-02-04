import express, { Express } from "express";
import { rateLimit } from "express-rate-limit";
import cookieParser from "cookie-parser";
import compression from "compression";
import bodyParser from "body-parser";

import helmet from "helmet";
import cors from "cors";
import path from "path";
import { Routes } from "@/routes/init";
import Database from "@/database/init";
import { logRequest } from "./utils/logger";

const app: Express = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(logRequest);

app.set("trust proxy", false);
app.use(bodyParser.json({ limit: "128kb" }));
app.use(express.static(path.join("public")));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: "Too many requests, please try again later.",
});

app.use(limiter);

const db = new Database("database", { dialect: "sqlite", storage: "./database1.sqlite", logging: false });

await db.load("./models/users"); // load specific model
await db.loadAll("./models"); // load all models in specific directory
await db.sync(); // sychronize models with database

const routes = new Routes(app);
await routes.listenAll(); // listen all

export default app;
