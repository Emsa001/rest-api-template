import { Express } from "express";
import fs from "fs";
import path from "path";
import logger from "@/utils/logger";

import { ActiveRoute, RouteInstance } from "@/types/routes";

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
    active: ActiveRoute[] = [];

    constructor(app: Express) {
        this.app = app;
    }

    async listen(file: string) {
        try {
            const routePath: string = path.join("./src/routes", file);

            const RouteClass = (await import(routePath)).default;
            const routeInstance: RouteInstance = new RouteClass();
            if (this.isActive({ listening: routeInstance.listening }))
                return logger.warn({
                    message: `Route 📁 ${routeInstance.listening} is already active`,
                });

            this.active.push({ file, name: routeInstance.name, listening: routeInstance.listening });
            this.app.use(routeInstance.listening, routeInstance.router); // Add route to express app

            logger.success({
                message: `Route 📁 listening on ${routeInstance.listening}`,
            });
        } catch (error) {
            logger.error({
                message: `Error occurred while loading route ${file}:`,
                object: error,
            });
            throw error; // Optionally rethrow to handle higher up
        }
    }

    async listenAll() {
        try {
            const routeFiles: string[] = fs.readdirSync("./src/routes");
            for (const file of routeFiles) {
                if (file.startsWith("_") || !file.endsWith(".ts") || this.isActive({ file })) continue;

                await this.listen(file);
            }
        } catch (error) {
            logger.error({
                message: `Error occurred while loading routes:`,
                object: error,
            });
            throw error; // Optionally rethrow to handle higher up
        }
    }

    isActive(arg: ActiveRoute): boolean {
        return !!this.active.find((active: ActiveRoute) => active.listening === arg.listening || active.file === arg.file?.replace(".ts", ""));
    }
}

export { Routes, BaseRoute };
