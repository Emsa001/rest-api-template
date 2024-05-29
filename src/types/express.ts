import { Request, Response, NextFunction } from "express";

export interface FRequest {
    res: Response;
    req: Request;
    next: NextFunction;
}
