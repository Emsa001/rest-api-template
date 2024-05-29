import { Router } from "express";

export interface ActiveRoute {
    file?: string;
    name?: string;
    endpoint?: string;
}

export interface RouteInstance {
    name: string;
    endpoint: string;
    router: Router;
}

export interface BaseRouteConstructor {
    name: string;
    endpoint: string;
    path: string;
}

export class BaseRoute {
    name: string;
    endpoint: string;
    path: string;

    constructor({ name, endpoint, path }: BaseRouteConstructor) {
        this.name = name;
        this.endpoint = endpoint;
        this.path = path;
    }
}