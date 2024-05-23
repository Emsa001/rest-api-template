import { Request, Response, NextFunction } from "express";

import logger from "@/utils/logger";
import keys from "!/keys.json";

class UserRequest {
    data: any;
    headers: any;
    endpoint: string[];
    auth: string;

    req: Request;
    res: Response;
    next: NextFunction;

    constructor(req: Request, res: Response, next: NextFunction) {
        this.data = req.method == "GET" ? req.query : req.body;
        this.headers = req.headers;
        this.auth = req.headers.authorization || "";
        this.endpoint = req.url.split("/");

        this.req = req;
        this.res = res;
        this.next = next;
    }

    log() {
        const ip = this.req.ip;
        const status = this.res.statusCode;
        const endpoint = this.endpoint.join("/");
        const method = this.req.method;
        const user = this.headers['user-agent'] || "Unknown";

        logger.log({
            message: `${ip} - ${method} ${endpoint} - ${status}`,
        });

        logger.log({
            message: `${ip} - ${method} ${endpoint} - ${status} - User: ${user}`,
            file: process.env.REQUESTS_LOGS,
        });

    }

    authorize() {
        const authHeader = this.headers['authorization'];
        if (!authHeader){
            logger.error({
                message: "Unauthorized request - no token provided",
                object: { auth: authHeader },
            });
            return this.res.status(401).send("Unauthorized");
        }

        const bearerToken = authHeader.split(' ')[1];
        if (!bearerToken){
            logger.error({
                message: `Unauthorized request - no token provided`,
                object: { auth: authHeader },
            });
            return this.res.status(401).send("Unauthorized");
        }

        const authKey = keys.find((key) => {
            return key.key === bearerToken;
        });

        if (!authKey) {
            logger.error({
                message: "Unauthorized request - invalid token",
                object: { auth: bearerToken },
            });
            return this.res.status(401).send("Unauthorized");
        }

        const permissions = authKey.permissions.filter((p) => p.endpoint === this.endpoint[1])[0];
        if (permissions.access != "*" && permissions.access.includes(this.endpoint[2])) {
            logger.error({
                message: "Unauthorized request - no permission to access this endpoint",
                object: { endpoint: this.endpoint },
            });
            return this.res.status(403).send("Unauthorized");
        }

        return this.next();
    }
}

export default UserRequest;