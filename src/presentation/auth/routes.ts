import { Router } from "express";
import { AuthController } from "./controller";
import { AuthDatasourceImpl } from "../../infrastructure/datasource/auth/auth.datasource.impl";
import { AuthRepositoryImpl } from "../../infrastructure/repositories/auth/auth.repository.impl";

export class AuthRoutes {
    static get routes(): Router {
        const router = Router();

        const datasource = new AuthDatasourceImpl();
        const repository = new AuthRepositoryImpl(datasource);

        const controller = new AuthController(repository);

        router.post('/login', controller.login);

        return router;
    }
}