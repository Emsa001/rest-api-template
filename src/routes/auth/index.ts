import express, { Request, Response, NextFunction } from "express";
import { fileURLToPath } from "url";
import { UserRequest, AcceptRequest } from "@/utils/request";
import { BaseRoute } from "!/src/types/routes";
import validate from "!/src/schemas/validate";
import schemas from "!/src/schemas/users";

import { login } from "./endpoints/login";
import { register } from "./endpoints/register";
import { verify } from "./endpoints/verify";

class Route extends BaseRoute {
    router = express.Router();

    constructor() {
        super({
            name: "auth",
            endpoint: "/auth",
            path: fileURLToPath(import.meta.url),
        });
        this.router.use(this.setHeaders.bind(this));
        this.request({ auth: false });
        this.setEndpoints();
    }

    private setEndpoints(): Response<any, Record<string, any>> | NextFunction | void {
        this.router.get("/", (req: Request, res: Response) => {
            res.status(200).json({ message: "Hello World!" });
        });
        
        this.router.post("/login", validate(schemas.login), login);
        this.router.post("/register", validate(schemas.register), register);
        this.router.post("/verify", validate(schemas.verify), verify);

        this.router.all("*", this.handleBadRequest.bind(this));
    }

    private handleBadRequest(req: Request, res: Response) {
        if(res.headersSent) return;
        return res.status(400).json({ message: "Bad Request." });
    }

    private setHeaders(req: Request, res: Response, next: NextFunction) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    }

    private request(settings: AcceptRequest) {
        this.router.use((req: Request, res: Response, next: NextFunction) => {
            const request = new UserRequest(req, res, next);
            request.accept(settings);
        });
    }
}

export default Route;