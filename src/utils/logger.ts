import pino from "pino";
import { Request, Response, NextFunction } from "express";
import fs from "fs";

if (!fs.existsSync("./logs")) {
    fs.mkdirSync("./logs");
}

const prettyStream = pino.transport({
    target: "pino-pretty",
    options: {
        colorize: true,
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
        singleLine: true,
    },
});

const Logger = pino(
    {
        level: "debug",
        base: null,
    },
    pino.multistream([
        { level: "info", stream: pino.destination("./logs/info.log") },
        { level: "error", stream: pino.destination("./logs/error.log") },
        { level: "warn", stream: pino.destination("./logs/warn.log") },
        { level: "fatal", stream: pino.destination("./logs/fatal.log") },
        { level: "debug", stream: prettyStream },
    ])
);

export function logRequest(req: Request, res: Response, next: NextFunction) {
    const start = Date.now(); 

    res.on("finish", () => {
        const responseTime = Date.now() - start;

        Logger.info(
            `${res.statusCode} | ${req.method} ${req.originalUrl} ${responseTime}ms`
        );
    });

    next();
}

export default Logger;
