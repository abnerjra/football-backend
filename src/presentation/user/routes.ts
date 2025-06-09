import { Router } from "express";
import { UserController } from "./controller";
import { AuthMiddleware, CheckPermissionMiddleware } from "../middlewares";
import { UserDatasourceImpl } from "../../infrastructure/datasource/user/user.datasource.impl";
import { UserRepositoryImpl } from "../../infrastructure/repositories/user/user.repository.impl";

export class UserRoutes {
    static get routes(): Router {
        const router = Router()

        const datasource = new UserDatasourceImpl();
        const repository = new UserRepositoryImpl(datasource);
        const controller = new UserController(repository);

        router.get('/', CheckPermissionMiddleware.execute('read'), controller.getAll);
        router.get('/:id', CheckPermissionMiddleware.execute('read'), controller.getById)
        router.post('/', CheckPermissionMiddleware.execute('create'), controller.create)
        router.put('/:id', CheckPermissionMiddleware.execute('update'), controller.update)

        return router;
    }
}