import { Express, Request, Response } from "express";
import fs from "fs";
import path from "path";
import logger from "@utils/logger";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

class BaseRoute {
    name: string;
    listening: string;
    path: string;

    constructor(name: string, listening: string, path: string) {
        this.name = name;
        this.listening = listening;
        this.path = path;
    }
}

class Routes {
    app: Express;

    constructor(app: Express) {
        this.app = app;
        this.load();
    }

    load() {
        try {
            logger.log({
                message: `Loading routes...`,
            });
            const routeFiles: string[] = fs.readdirSync("./src/routes");

            routeFiles.forEach((file: string) => {
                if (!file.startsWith("_") && file.endsWith(".ts")) {
                    const routePath: string = path.join("./src/routes", file);

                    const RouteClass = require(routePath).default;
                    const routeInstance = new RouteClass();

                    this.app.use(routeInstance.listening, routeInstance.router);

                    logger.success({
                        message: `Route 📁 ${routeInstance.name} listening on ${routeInstance.listening}`,
                    });
                }
            });
        } catch (error) {
            logger.error({
                message: `Error occurred while loading routes:`,
                object: error,
            });
        }
    }
}

export { Routes, BaseRoute };
