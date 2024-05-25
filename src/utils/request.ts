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
        this.data = req.method === "GET" ? req.query : req.body;
        this.headers = req.headers;
        this.auth = req.headers.authorization || "";
        this.endpoint = req.url.split("/");
        this.req = req;
        this.res = res;
        this.next = next;
    }

    log(message: string, level: 'log' | 'warn' | 'success' | 'error', obj: any = {}) {
        const ip = this.req.ip;
        const status = this.res.statusCode;
        const endpoint = this.endpoint.join("/");
        const method = this.req.method;
        const user = this.headers["user-agent"] || "Unknown";

        logger[level]({
            message: `${ip} - ${method} ${endpoint} - ${status} - User: ${user} - ${message}`,
            object: obj,
            file: level == 'error' ? process.env.REQ_ERRORS_LOGS_FILE : process.env.REQ_LOGS_FILE,
        });
    }

    authorize() {
        try {
            if (!this.auth) {
                this.log("Unauthorized - Missing auth header", 'error', { auth: this.auth });
                return this.res.status(401).send("Unauthorized");
            }

            const bearerToken = this.auth.split(" ")[1];
            if (!bearerToken) {
                this.log("Unauthorized - Missing bearer token", 'error', { auth: this.auth });
                return this.res.status(401).send("Unauthorized");
            }

            const authKey = keys.find(key => key.key === bearerToken);
            if (!authKey) {
                this.log("Unauthorized - Invalid token", 'error', { auth: bearerToken });
                return this.res.status(401).send("Unauthorized");
            }

            const permission = authKey.permissions.find(p => p.endpoint === this.endpoint[1]);
            if (!permission || (permission.access !== "*" && !permission.access.includes(this.endpoint[2]))) {
                this.log("Forbidden - Insufficient permissions", 'error', { endpoint: this.endpoint });
                return this.res.status(403).send("Forbidden");
            }

            this.log("Authorized", 'success', { endpoint: this.endpoint });
            return this.next();
        } catch (err) {
            this.log("Internal server error", 'error', err);
            return this.res.status(500).send("Internal server error");
        }
    }
}

export default UserRequest;
