import express, { Express } from "express";
import { rateLimit } from "express-rate-limit";
import cookieParser from "cookie-parser";
import compression from "compression";
import bodyParser from "body-parser";

import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import UserRequest from "@/utils/request";
import Routes from "@/routes/_init";

const app: Express = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("combined"));
app.use(cookieParser());

app.set("trust proxy", true);
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

app.use((req, res, next) => {
    const request = new UserRequest(req, res, next);

    request.authorize();
    request.log();
});

const routes = new Routes(app);
// routes.list();
routes.init();

export default app;