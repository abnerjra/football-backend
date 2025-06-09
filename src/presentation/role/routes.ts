import { Router } from "express";
import { RoleController } from "./controller";
import { RoleDatasourceImpl } from "../../infrastructure/datasource/role/role.datasource.impl";
import { RoleRepositoryImpl } from "../../infrastructure/repositories/role/role.repository.impl";
import { CheckPermissionMiddleware } from "../middlewares";

export class RoleRoutes {
    static get routes(): Router {
        const router = Router()

        const datasource = new RoleDatasourceImpl();
        const repository = new RoleRepositoryImpl(datasource);
        const controller = new RoleController(repository);

        router.get('/', CheckPermissionMiddleware.execute('read'), controller.getAll);
        router.get('/:id', CheckPermissionMiddleware.execute('read'), controller.getById);
        router.post('/', CheckPermissionMiddleware.execute('create'), controller.create);
        router.put('/:id', CheckPermissionMiddleware.execute('update'), controller.update);

        return router;
    }
}