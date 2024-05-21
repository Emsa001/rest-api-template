// src/interfaces.ts
import { Router } from "express";

export interface ActiveRoute {
    file?: string;
    name?: string;
    listening?: string;
}

export interface RouteInstance {
    name: string;
    listening: string;
    router: Router;
}
