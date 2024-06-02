import { Request, Response, NextFunction } from "express";
import logger from "@/utils/logger";
import keys from "!/.keys.json";

interface AcceptRequest {
    auth: boolean;
    log: boolean;
}

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

    reqlog(message: string, level: "log" | "warn" | "success" | "error", obj: any = {}) {
        const ip = this.req.ip;
        const status = this.res.statusCode;
        const endpoint = this.endpoint.join("/");
        const method = this.req.method;
        const user = this.headers["user-agent"] || "Unknown";

        logger[level]({
            message: `${ip} - ${method} ${endpoint} - ${status} - User: ${user} - ${message}`,
            object: obj,
            file: level == "error" ? process.env.REQ_ERRORS_LOGS_FILE : process.env.REQ_LOGS_FILE,
        });
    }

    accept({ auth, log }: AcceptRequest) {
        try {
            if (auth) {
                if (!this.auth) {
                    if (log) this.reqlog("Unauthorized - Missing auth header", "error", { auth: this.auth });
                    return this.res.status(401).send("Unauthorized");
                }

                const bearerToken = this.auth.split(" ")[1];
                if (!bearerToken) {
                    if (log) this.reqlog("Unauthorized - Missing bearer token", "error", { auth: this.auth });
                    return this.res.status(401).send("Unauthorized");
                }

                const authKey = keys.find((key) => key.key === bearerToken);
                if (!authKey) {
                    if (log) this.reqlog("Unauthorized - Invalid token", "error", { auth: bearerToken });
                    return this.res.status(401).send("Unauthorized");
                }

                const permission = authKey.permissions.find((p) => p.endpoint === this.endpoint[1]);
                if (!permission || (permission.access !== "*" && !permission.access.includes(this.endpoint[2]))) {
                    if (log) this.reqlog("Forbidden - Insufficient permissions", "error", { endpoint: this.endpoint });
                    return this.res.status(403).send("Forbidden");
                }
            }
            if (log) this.reqlog(auth ? "Authorized" : "", "success", { endpoint: this.req.url });
            return this.next();
        } catch (err) {
            this.reqlog("Internal server error", "error", err);
            return this.res.status(500).send("Internal server error");
        }
    }
}

export { UserRequest, AcceptRequest };
