import express, { Request, Response, NextFunction } from "express";
import validate from "@/utils/validation";
import schemas from "@/utils/schemas";
import authController from "@/controllers/auth";
import { BaseRoute } from "./_init";

class AuthRoute extends BaseRoute {
    router = express.Router();

    constructor() {
        super("auth", "/auth", __filename);
        this.router.use(this.setHeaders.bind(this));
        this.initRoutes();
    }

    private initRoutes() {
        this.router.post("/register", validate(schemas.register), authController.register);
        this.router.post("/login", validate(schemas.login), authController.login);

        this.router.all("*", this.handleBadRequest.bind(this));
    }

    private handleBadRequest(req: Request, res: Response): void {
        res.status(400).json({ message: "Bad Request." });
    }

    private setHeaders(req: Request, res: Response, next: NextFunction): void {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    }
}

export default AuthRoute;
