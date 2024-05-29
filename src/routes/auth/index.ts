import express, { Request, Response, NextFunction } from "express";
import { fileURLToPath } from "url";
import { UserRequest, AcceptRequest } from "@/utils/request";
import { BaseRoute } from "!/src/types/routes";
import { hello } from "./endpoints/hello";

class AuthRoute extends BaseRoute {
    router = express.Router();

    constructor() {
        super({
            name: "auth",
            endpoint: "/auth",
            path: fileURLToPath(import.meta.url),
        });
        this.router.use(this.setHeaders.bind(this));
        this.request({ auth: true, log: true });
        this.setEndpoints();
    }

    private setEndpoints(): void {
        this.router.get("/", (req: Request, res: Response) => {
            return res.status(200).json({ message: "Hello World from /auth" });
        });

        this.router.get("/hello", hello);

        this.router.all("*", this.handleBadRequest.bind(this));
    }

    private handleBadRequest(req: Request, res: Response) {
        res.status(400).json({ message: "Bad Request." });
    }

    private setHeaders(req: Request, res: Response, next: NextFunction): void {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    }

    private request(settings: AcceptRequest) {
        this.router.use((req: Request, res: Response, next: NextFunction) => {
            const request = new UserRequest(req, res, next);
            return request.accept(settings);
        });
    }
}

export default AuthRoute;
