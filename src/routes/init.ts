import { Express } from "express";
import fs from "fs";
import * as path from "path";
import logger from "@/utils/logger";
import { ActiveRoute, RouteInstance } from "@/types/routes";

class Routes {
    app: Express;
    active: ActiveRoute[] = [];
    auth: boolean = true;

    constructor(app: Express) {
        this.app = app;
    }

    async listen(file: string) {
        try {
            const routePath: string = path.join("./src/routes", file, "index.ts");

            const RouteClass = (await import(routePath)).default;
            const routeInstance: RouteInstance = new RouteClass();
            if (this.isActive({ endpoint: routeInstance.endpoint })) return logger.warn(`Route 📁 ${routeInstance.endpoint} is already active`);

            this.active.push({ file, name: routeInstance.name, endpoint: routeInstance.endpoint });
            this.app.use(routeInstance.endpoint, routeInstance.router);

            logger.info(`Route 📁 endpoint on ${routeInstance.endpoint}`);
        } catch (error) {
            logger.error(`Error occurred while loading route ${file}:`, {
                object: error,
            });
            console.log(error);
        }
    }

    async listenAll() {
        try {
            const routeFiles: string[] = fs.readdirSync("./src/routes");
            for (const file of routeFiles) {
                const fullPath = path.join("./src/routes", file);
                if (fs.statSync(fullPath).isDirectory()) {
                    const indexFilePath = path.join(fullPath, "index.ts");
                    const filename = file.replace(".ts", "");
                    if (fs.existsSync(indexFilePath) && !this.isActive({ file: filename })) await this.listen(filename);
                }
            }
        } catch (error) {
            logger.error(`Error occurred while loading routes:`, {
                object: error,
            });
            console.log(error);
        }
    }

    isActive(arg: ActiveRoute): boolean {
        return !!this.active.find((active: ActiveRoute) => active.endpoint === arg.endpoint || active.file === arg.file?.replace(".ts", ""));
    }
}

export { Routes };
