import express, { Request, Response, NextFunction } from "express";
import validate from "@/utils/validation";
import schemas from "@/utils/schemas";
import { BaseRoute } from "./_init";
import { fileURLToPath } from "url";
import { hello_params, hello_query } from "@/controllers/public/hello";

class AuthRoute extends BaseRoute {
    router = express.Router();

    constructor() {
        super("auth", "/public", fileURLToPath(import.meta.url));
        this.router.use(this.setHeaders.bind(this));
        this.setEndpoints();
    }

    private setEndpoints(): void {
        this.router.get("/", (req: Request, res: Response) => {
            return res.status(200).json({ message: "Hello World" });
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
}

export default AuthRoute;
