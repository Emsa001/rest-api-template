import { Express } from "express";

import fs from "fs";
import path from "path";

import logger from "@utils/logger";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

interface Route {
    name: string;
    listening: string;
    path: string;
}

class Routes {
    app: Express;
    loadedRoutes: Route[] = [];

    constructor(app: Express) {
        this.app = app;
        this.load();
    }

    private load(){
        try {
            logger.log({
                message: `Loading routes...`,
            });
            const routeFiles: string[] = fs.readdirSync("./src/routes");

            routeFiles.forEach((file: string) => {
                if (!file.startsWith("_") && file.endsWith(".ts")) {
                    const routePath: string = path.join("./src/routes", file);
                    const listening: string = "/" + path.parse(file).name;

                    this.loadedRoutes.push(<Route>{name: file, listening, path:routePath});
                }
            });
        } catch (error) {
            logger.error({
                message: `Error occurred while loading routes:`,
                object: error,
            });
        }
    }

    init() {
        try {
            logger.log({
                message: `Initializing routes...`,
            });

            this.loadedRoutes.forEach((route) => {
                this.app.use(route.listening, require(route.path));

                logger.success({
                    message: `Route 📁 ${route.name} listening on ${route.listening}`,
                });
            });
        } catch (error) {
            logger.error({
                message: `Error occurred while initializing routes:`,
                object: error,
            });
        }
    }
}

export default Routes;