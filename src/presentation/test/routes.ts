import { Router } from "express";
import { TestController } from './controller';

export class TestRoutes {
    static get routes(): Router{
        const router = Router();

        const controller = new TestController()

        router.get('/', controller.getDate);

        return router
    }
}