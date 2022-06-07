import { Router } from "express";

export abstract class Routes {
    public router: Router;

    constructor() {
        this.router = Router();

    }

    protected abstract routes(): void
}
