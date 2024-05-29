import express, { Request, Response, NextFunction } from "express";
import validate from "@/utils/validation";
import schemas from "@/utils/schemas";
import { fileURLToPath } from "url";
import { UserRequest, AcceptRequest } from "@/utils/request";
import { BaseRoute } from "!/src/types/routes";
import { hello_params, hello_query } from "./endpoints/hello";

class PublicRoute extends BaseRoute {
    router = express.Router();

    constructor() {
        super({
            name: "public",
            endpoint: "/public",
            path: fileURLToPath(import.meta.url),
        });
        this.router.use(this.setHeaders.bind(this));
        this.request({ auth: false, log: true });
        this.setEndpoints();
    }

    private setEndpoints(): void {
        this.router.get("/", (req: Request, res: Response) => {
            return res.status(200).json({ message: "Hello World from /public" });
        });

        this.router.get("/hello/:user", validate(schemas.hello), hello_params);
        this.router.get("/hello2", validate(schemas.hello), hello_query);

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

export default PublicRoute;
