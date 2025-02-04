import { Request, Response, NextFunction } from "express";
import keys from "!/.keys.json";
import { IKey, IPermission } from "../types/other";

interface AcceptRequest {
    auth: boolean;
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
        this.endpoint = req.originalUrl.split("/").filter((e: string) => e !== "");
        this.req = req;
        this.res = res;
        this.next = next;
    }

    accept({ auth }: AcceptRequest) {
        if (this.res.headersSent) return;

        if (!auth) {
            return this.next();
        }

        if (!this.auth) return this.res.status(401).send("Unauthorized");

        const bearerToken = this.auth.split(" ")[1];
        if (!bearerToken) return this.res.status(401).send("Unauthorized");

        const authKey = keys.find((key: IKey) => key.key === bearerToken);
        if (!authKey) return this.res.status(401).send("Unauthorized");

        const fullEndpoint = this.endpoint.slice().splice(-1).join("/");
        const endpointCheck = authKey.permissions.find((p: IPermission) => p.endpoint === this.endpoint[0] || p.endpoint === fullEndpoint);

        if (!endpointCheck) {
            return this.res.status(403).send("Forbidden");
        }

        const temp = this.endpoint.slice().splice(1).join("/");
        const hasAccess = endpointCheck.access.some((a: string) => {
            if (a === "*" || a === this.endpoint[1] || a === temp) {
                return this.next();
            }
            return false;
        });

        if (!hasAccess) {
            return this.res.status(403).send("Forbidden");
        }
    }
}

export { UserRequest, AcceptRequest };
